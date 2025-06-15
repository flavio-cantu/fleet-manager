terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.100.0"
    }
    null = {
      source  = "hashicorp/null"
      version = "~> 3.2.4"
    }
  }

  required_version = "~> 1.11.4"

  backend "s3" {
    bucket = "cantu-terraform-state"
    key    = "shadow-guardian/cert/terraform.tfstate"
    region = "us-east-1"
  }
}
