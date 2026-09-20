resource "aws_cloudwatch_event_bus" "changes" {
  name = "synccode-changes"
}

resource "aws_cloudwatch_event_rule" "push_to_queue" {
  name           = "${var.project_name}-push-to-queue"
  event_bus_name = aws_cloudwatch_event_bus.changes.name

  event_pattern = jsonencode({
    source      = ["synccode.github"]
    detail-type = ["github.push"]
  })
}

resource "aws_cloudwatch_event_target" "sqs" {
  rule           = aws_cloudwatch_event_rule.push_to_queue.name
  event_bus_name = aws_cloudwatch_event_bus.changes.name
  target_id      = "change-queue"
  arn            = aws_sqs_queue.changes.arn
}
