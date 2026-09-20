import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import type { SQSHandler } from "aws-lambda";
import type { ChangeRecord, GitHubPush } from "./contracts.js";
const db = DynamoDBDocumentClient.from(new DynamoDBClient({}));
export const handler: SQSHandler = async (event) => { for (const message of event.Records) { const envelope = JSON.parse(message.body) as { detail: GitHubPush }; const push = envelope.detail; const files = [...new Set((push.commits ?? []).flatMap((commit) => [...(commit.added ?? []), ...(commit.modified ?? []), ...(commit.removed ?? [])]))]; const record: ChangeRecord = { repositoryId: String(push.repository.id), changeId: push.after, repository: push.repository.full_name, sha: push.after, branch: push.ref.replace("refs/heads/", ""), author: push.head_commit?.author?.name ?? push.sender.login, title: push.head_commit?.message ?? `Push to ${push.repository.full_name}`, files, createdAt: new Date().toISOString(), status: "detected" }; await db.send(new PutCommand({ TableName: process.env.CHANGES_TABLE, Item: record })); } };
