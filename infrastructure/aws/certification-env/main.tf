locals {
  # Common tags to be assigned to all resources
  common_tags = {
    type    = "STAR-CITZEN",
    company = "SHADOW-GUARDIAN"
  }
}

locals {
  absolute_path = abspath("${path.module}/../../../")
}

data "aws_region" "current" {
  #get region
}

# S3 Bucket ================
resource "random_id" "bucket_suffix" {
  byte_length = 10
}

resource "aws_s3_bucket" "bucket-shadow_guardian" {
  bucket        = "sc-shadow-guardian-${random_id.bucket_suffix.hex}"
  force_destroy = true # Permite deletar mesmo com arquivos (apenas para testes)
  tags          = local.common_tags
}
