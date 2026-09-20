resource "aws_dynamodb_table" "changes" {
  name         = "${var.project_name}-changes"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "repositoryId"
  range_key    = "changeId"

  attribute {
    name = "repositoryId"
    type = "S"
  }

  attribute {
    name = "changeId"
    type = "S"
  }

}
