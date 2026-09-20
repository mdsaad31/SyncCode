variable "aws_region" {
  description = "AWS region to deploy into"
  type        = string
  default     = "ap-south-1"
}

variable "project_name" {
  description = "Prefix for all resource names"
  type        = string
  default     = "synccode"
}

variable "environment" {
  description = "Deployment environment"
  type        = string
  default     = "production"
}

variable "lambda_runtime" {
  description = "Lambda runtime identifier"
  type        = string
  default     = "nodejs22.x"
}

variable "lambda_memory_size" {
  description = "Lambda memory in MB"
  type        = number
  default     = 256
}

variable "lambda_timeout" {
  description = "Lambda timeout in seconds"
  type        = number
  default     = 30
}

variable "api_stage_name" {
  description = "API Gateway stage name"
  type        = string
  default     = "v1"
}

variable "sqs_max_receive_count" {
  description = "SQS max receive count before DLQ"
  type        = number
  default     = 3
}

variable "frontend_build_dir" {
  description = "Path to Next.js static export output relative to terraform dir"
  type        = string
  default     = "../out"
}

variable "tags" {
  description = "Default tags for all resources"
  type        = map(string)
  default = {
    Project     = "SyncCode"
    ManagedBy   = "Terraform"
  }
}
