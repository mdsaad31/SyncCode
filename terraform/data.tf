data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

data "archive_file" "webhook_zip" {
  type        = "zip"
  source_file = "${path.module}/dist/webhook/index.js"
  output_path = "${path.module}/dist/webhook.zip"
}

data "archive_file" "processor_zip" {
  type        = "zip"
  source_file = "${path.module}/dist/processor/index.js"
  output_path = "${path.module}/dist/processor.zip"
}

data "archive_file" "reader_zip" {
  type        = "zip"
  source_file = "${path.module}/dist/reader/index.js"
  output_path = "${path.module}/dist/reader.zip"
}
