resource "aws_api_gateway_rest_api" "api" {
  name        = "${var.project_name}-api"
  description = "SyncCode API"
}

# -----------------------------------------------------------------------------
# POST /webhooks/github -> webhook Lambda
# -----------------------------------------------------------------------------

resource "aws_api_gateway_resource" "webhooks" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  parent_id   = aws_api_gateway_rest_api.api.root_resource_id
  path_part   = "webhooks"
}

resource "aws_api_gateway_resource" "github" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  parent_id   = aws_api_gateway_resource.webhooks.id
  path_part   = "github"
}

resource "aws_api_gateway_method" "webhook_post" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  resource_id   = aws_api_gateway_resource.github.id
  http_method   = "POST"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "webhook_post" {
  rest_api_id             = aws_api_gateway_rest_api.api.id
  resource_id             = aws_api_gateway_resource.github.id
  http_method             = aws_api_gateway_method.webhook_post.http_method
  type                    = "AWS_PROXY"
  integration_http_method = "POST"
  uri                     = aws_lambda_function.webhook.invoke_arn
}

resource "aws_lambda_permission" "webhook_apigw" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.webhook.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.api.execution_arn}/*/*"
}

# -----------------------------------------------------------------------------
# GET /changes -> reader Lambda
# -----------------------------------------------------------------------------

resource "aws_api_gateway_resource" "changes" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  parent_id   = aws_api_gateway_rest_api.api.root_resource_id
  path_part   = "changes"
}

resource "aws_api_gateway_method" "changes_get" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  resource_id   = aws_api_gateway_resource.changes.id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "changes_get" {
  rest_api_id             = aws_api_gateway_rest_api.api.id
  resource_id             = aws_api_gateway_resource.changes.id
  http_method             = aws_api_gateway_method.changes_get.http_method
  type                    = "AWS_PROXY"
  integration_http_method = "POST"
  uri                     = aws_lambda_function.reader.invoke_arn
}

resource "aws_lambda_permission" "reader_apigw" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.reader.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.api.execution_arn}/*/*"
}

# -----------------------------------------------------------------------------
# Deployment and stage
# -----------------------------------------------------------------------------

resource "aws_api_gateway_deployment" "api" {
  rest_api_id = aws_api_gateway_rest_api.api.id

  triggers = {
    redeployment = sha1(jsonencode([
      aws_api_gateway_resource.webhooks.id,
      aws_api_gateway_resource.github.id,
      aws_api_gateway_resource.changes.id,
      aws_api_gateway_method.webhook_post.id,
      aws_api_gateway_method.changes_get.id,
      aws_api_gateway_integration.webhook_post.id,
      aws_api_gateway_integration.changes_get.id,
    ]))
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_api_gateway_stage" "v1" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  deployment_id = aws_api_gateway_deployment.api.id
  stage_name    = var.api_stage_name
}
