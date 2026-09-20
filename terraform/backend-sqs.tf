resource "aws_sqs_queue" "changes_dlq" {
  name                    = "${var.project_name}-changes-dlq"
  sqs_managed_sse_enabled = true
}

resource "aws_sqs_queue" "changes" {
  name                    = "${var.project_name}-changes"
  sqs_managed_sse_enabled = true

  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.changes_dlq.arn
    maxReceiveCount     = var.sqs_max_receive_count
  })
}

resource "aws_sqs_queue_policy" "changes" {
  queue_url = aws_sqs_queue.changes.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "AllowEventBridgeSend"
        Effect    = "Allow"
        Principal = { Service = "events.amazonaws.com" }
        Action    = "sqs:SendMessage"
        Resource  = aws_sqs_queue.changes.arn
        Condition = {
          ArnEquals = {
            "aws:SourceArn" = aws_cloudwatch_event_rule.push_to_queue.arn
          }
        }
      }
    ]
  })
}
