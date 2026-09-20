output "api_url" {
  description = "API Gateway invoke URL"
  value       = aws_api_gateway_stage.v1.invoke_url
}

output "frontend_url" {
  description = "S3 website URL for the frontend"
  value       = "http://${aws_s3_bucket_website_configuration.frontend.website_endpoint}"
}

output "s3_bucket_name" {
  description = "S3 bucket for frontend static assets"
  value       = aws_s3_bucket.frontend.id
}

output "dynamodb_table_name" {
  description = "DynamoDB changes table name"
  value       = aws_dynamodb_table.changes.name
}

output "webhook_function_name" {
  description = "Webhook Lambda function name"
  value       = aws_lambda_function.webhook.function_name
}

output "processor_function_name" {
  description = "Processor Lambda function name"
  value       = aws_lambda_function.processor.function_name
}

output "reader_function_name" {
  description = "Reader Lambda function name"
  value       = aws_lambda_function.reader.function_name
}
