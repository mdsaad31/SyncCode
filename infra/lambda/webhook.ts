import { createHmac, timingSafeEqual } from "node:crypto";
import { EventBridgeClient, PutEventsCommand } from "@aws-sdk/client-eventbridge";
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";
import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import type { GitHubPush } from "./contracts.js";
const events = new EventBridgeClient({}); const secrets = new SecretsManagerClient({});
async function secret() { const value = await secrets.send(new GetSecretValueCommand({ SecretId: process.env.WEBHOOK_SECRET_ARN })); const parsed = JSON.parse(value.SecretString ?? "{}"); return parsed.webhookSecret as string; }
function verified(body: string, signature: string | undefined, key: string) { if (!signature?.startsWith("sha256=")) return false; const expected = createHmac("sha256", key).update(body).digest("hex"); const actual = signature.slice(7); return actual.length === expected.length && timingSafeEqual(Buffer.from(actual), Buffer.from(expected)); }
export const handler: APIGatewayProxyHandlerV2 = async (event) => { const raw = event.body ?? ""; if (!verified(raw, event.headers["x-hub-signature-256"] ?? event.headers["X-Hub-Signature-256"], await secret())) return { statusCode: 401, body: JSON.stringify({ message: "Invalid GitHub signature" }) }; if ((event.headers["x-github-event"] ?? event.headers["X-GitHub-Event"]) !== "push") return { statusCode: 202, body: "{}" }; const push = JSON.parse(raw) as GitHubPush; await events.send(new PutEventsCommand({ Entries: [{ EventBusName: process.env.EVENT_BUS_NAME, Source: "synccode.github", DetailType: "github.push", Detail: JSON.stringify(push) }] })); return { statusCode: 202, body: JSON.stringify({ accepted: true }) }; };
