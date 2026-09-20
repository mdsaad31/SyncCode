terraform {
  required_version = ">= 1.5"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    archive = {
      source  = "hashicorp/archive"
      version = "~> 2.0"
    }
  }

  # Uncomment for remote state:
  # backend "s3" {
  #   bucket         = "synccode-tfstate"
  #   key            = "terraform.tfstate"
  #   region         = "ap-south-1"
  #   dynamodb_table = "synccode-tflock"
  #   encrypt        = true
  # }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = var.tags
  }
}
