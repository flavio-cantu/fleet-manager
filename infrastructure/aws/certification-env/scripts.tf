resource "null_resource" "upload_angular_app" {
  depends_on = [aws_s3_bucket.bucket-shadow_guardian]
  provisioner "local-exec" {
    command = <<-EOT
      ../../build/s3_angular_upload.sh ${aws_s3_bucket.bucket-shadow_guardian.bucket}/app ${local.absolute_path}/frontend
      ../../build/s3_nginx_upload.sh ${aws_s3_bucket.bucket-shadow_guardian.bucket}/nginx/default.conf ${local.absolute_path}/infrastructure/build/nginx_config/default.conf
    EOT
  }
}
