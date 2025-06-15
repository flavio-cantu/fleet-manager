output "ec2_public_ip" {
  value = aws_instance.shadow_guardian_instance.public_ip
}

output "ec2_public_dns" {
  value = aws_instance.shadow_guardian_instance.public_dns
}

output "s3_bucket_name" {
  value = aws_s3_bucket.bucket-shadow_guardian.bucket
}
