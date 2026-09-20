# -----------------------------------------------------------------------------
# IAM: shared assume-role policy for Lambda
# -----------------------------------------------------------------------------

data "aws_iam_policy_document" "lambda_assume" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

# -----------------------------------------------------------------------------
# Webhook Lambda
# -----------------------------------------------------------------------------

resource "aws_iam_role" "webhook" {
  name               = "${var.project_name}-webhook-role"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume.json
}

resource "aws_iam_role_policy_attachment" "webhook_basic" {
  role       = aws_iam_role.webhook.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy" "webhook" {
  name = "${var.project_name}-webhook-policy"
  role = aws_iam_role.webhook.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = ["secretsmanager:GetSecretValue", "secretsmanager:DescribeSecret"]
        Resource = aws_secretsmanager_secret.github_webhook.arn
      },
      {
        Effect   = "Allow"
        Action   = ["events:PutEvents"]
        Resource = aws_cloudwatch_event_bus.changes.arn
      }
    ]
  })
}

resource "aws_lambda_function" "webhook" {
  function_name    = "${var.project_name}-webhook"
  runtime          = var.lambda_runtime
  handler          = "index.handler"
  filename         = data.archive_file.webhook_zip.output_path
  source_code_hash = data.archive_file.webhook_zip.output_base64sha256
  role             = aws_iam_role.webhook.arn
  memory_size      = var.lambda_memory_size
  timeout          = var.lambda_timeout

  environment {
    variables = {
      EVENT_BUS_NAME     = aws_cloudwatch_event_bus.changes.name
      WEBHOOK_SECRET_ARN = aws_secretsmanager_secret.github_webhook.arn
    }
  }
}

# -----------------------------------------------------------------------------
# Processor Lambda
# -----------------------------------------------------------------------------

resource "aws_iam_role" "processor" {
  name               = "${var.project_name}-processor-role"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume.json
}

resource "aws_iam_role_policy_attachment" "processor_basic" {
  role       = aws_iam_role.processor.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy" "processor" {
  name = "${var.project_name}-processor-policy"
  role = aws_iam_role.processor.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "dynamodb:PutItem",
          "dynamodb:GetItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
          "dynamodb:BatchGetItem",
          "dynamodb:BatchWriteItem",
          "dynamodb:Query",
          "dynamodb:Scan"
        ]
        Resource = aws_dynamodb_table.changes.arn
      },
      {
        Effect = "Allow"
        Action = [
          "sqs:ReceiveMessage",
          "sqs:DeleteMessage",
          "sqs:GetQueueAttributes",
          "sqs:ChangeMessageVisibility"
        ]
        Resource = aws_sqs_queue.changes.arn
      }
    ]
  })
}

resource "aws_lambda_function" "processor" {
  function_name    = "${var.project_name}-processor"
  runtime          = var.lambda_runtime
  handler          = "index.handler"
  filename         = data.archive_file.processor_zip.output_path
  source_code_hash = data.archive_file.processor_zip.output_base64sha256
  role             = aws_iam_role.processor.arn
  memory_size      = var.lambda_memory_size
  timeout          = var.lambda_timeout

  environment {
    variables = {
      CHANGES_TABLE = aws_dynamodb_table.changes.name
    }
  }
}

resource "aws_lambda_event_source_mapping" "processor_sqs" {
  event_source_arn = aws_sqs_queue.changes.arn
  function_name    = aws_lambda_function.processor.arn
  batch_size       = 10
}

# -----------------------------------------------------------------------------
# Reader Lambda
# -----------------------------------------------------------------------------

resource "aws_iam_role" "reader" {
  name               = "${var.project_name}-reader-role"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume.json
}

resource "aws_iam_role_policy_attachment" "reader_basic" {
  role       = aws_iam_role.reader.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy" "reader" {
  name = "${var.project_name}-reader-policy"
  role = aws_iam_role.reader.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "dynamodb:GetItem",
          "dynamodb:BatchGetItem",
          "dynamodb:Query",
          "dynamodb:Scan"
        ]
        Resource = aws_dynamodb_table.changes.arn
      }
    ]
  })
}

resource "aws_lambda_function" "reader" {
  function_name    = "${var.project_name}-reader"
  runtime          = var.lambda_runtime
  handler          = "index.handler"
  filename         = data.archive_file.reader_zip.output_path
  source_code_hash = data.archive_file.reader_zip.output_base64sha256
  role             = aws_iam_role.reader.arn
  memory_size      = var.lambda_memory_size
  timeout          = var.lambda_timeout

  environment {
    variables = {
      CHANGES_TABLE = aws_dynamodb_table.changes.name
    }
  }
}
