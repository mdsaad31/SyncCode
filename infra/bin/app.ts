#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { SyncCodeStack } from "../lib/synccode-stack.js";
const app = new cdk.App();
new SyncCodeStack(app, "SyncCodeStack");
