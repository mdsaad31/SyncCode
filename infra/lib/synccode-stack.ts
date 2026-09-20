import * as cdk from "aws-cdk-lib";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as events from "aws-cdk-lib/aws-events";
import * as targets from "aws-cdk-lib/aws-events-targets";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as lambdaNodejs from "aws-cdk-lib/aws-lambda-nodejs";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";
import * as sqs from "aws-cdk-lib/aws-sqs";
import * as eventSources from "aws-cdk-lib/aws-lambda-event-sources";
import { Construct } from "constructs";
import * as path from "node:path";

export class SyncCodeStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const changes = new dynamodb.Table(this, "Changes", { partitionKey: { name: "repositoryId", type: dynamodb.AttributeType.STRING }, sortKey: { name: "changeId", type: dynamodb.AttributeType.STRING }, billingMode: dynamodb.BillingMode.PAY_PER_REQUEST, removalPolicy: cdk.RemovalPolicy.RETAIN });
    const webhookSecret = new secretsmanager.Secret(this, "GitHubWebhookSecret", { description: "GitHub webhook secret JSON: { webhookSecret: string }" });
    const bus = new events.EventBus(this, "ChangeBus", { eventBusName: "synccode-changes" });
    const queue = new sqs.Queue(this, "ChangeQueue", { encryption: sqs.QueueEncryption.SQS_MANAGED, deadLetterQueue: { queue: new sqs.Queue(this, "ChangeDlq"), maxReceiveCount: 3 } });
    const root = path.join(import.meta.dirname, "..");
    const webhook = new lambdaNodejs.NodejsFunction(this, "GitHubWebhook", { entry: path.join(root, "lambda/webhook.ts"), environment: { EVENT_BUS_NAME: bus.eventBusName, WEBHOOK_SECRET_ARN: webhookSecret.secretArn }, runtime: lambda.Runtime.NODEJS_22_X });
    const processor = new lambdaNodejs.NodejsFunction(this, "ChangeProcessor", { entry: path.join(root, "lambda/processor.ts"), environment: { CHANGES_TABLE: changes.tableName }, runtime: lambda.Runtime.NODEJS_22_X });
    const reader = new lambdaNodejs.NodejsFunction(this, "ChangesReader", { entry: path.join(root, "lambda/reader.ts"), environment: { CHANGES_TABLE: changes.tableName }, runtime: lambda.Runtime.NODEJS_22_X });
    webhookSecret.grantRead(webhook); bus.grantPutEventsTo(webhook); changes.grantReadWriteData(processor); changes.grantReadData(reader);
    bus.addRule("PushToQueue", { eventPattern: { source: ["synccode.github"], detailType: ["github.push"] }, targets: [new targets.SqsQueue(queue)] });
    processor.addEventSource(new eventSources.SqsEventSource(queue));
    const api = new apigateway.RestApi(this, "Api", { deployOptions: { stageName: "v1" } });
    api.root.addResource("webhooks").addResource("github").addMethod("POST", new apigateway.LambdaIntegration(webhook));
    api.root.addResource("changes").addMethod("GET", new apigateway.LambdaIntegration(reader));
    new cdk.CfnOutput(this, "ApiUrl", { value: api.url });
  }
}
