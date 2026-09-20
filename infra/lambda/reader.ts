import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
const db = DynamoDBDocumentClient.from(new DynamoDBClient({}));
export const handler: APIGatewayProxyHandlerV2 = async () => { const result = await db.send(new ScanCommand({ TableName: process.env.CHANGES_TABLE })); return { statusCode: 200, headers: { "content-type": "application/json" }, body: JSON.stringify({ changes: result.Items ?? [] }) }; };
