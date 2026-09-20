resource "aws_secretsmanager_secret" "github_webhook" {
  name        = "${var.project_name}-github-webhook-secret"
  description = "GitHub webhook secret JSON: { webhookSecret: string }"
}

resource "aws_secretsmanager_secret_version" "github_webhook" {
  secret_id     = aws_secretsmanager_secret.github_webhook.id
  secret_string = jsonencode({ webhookSecret = "CHANGE_ME" })

  lifecycle {
    ignore_changes = [secret_string]
  }
}
