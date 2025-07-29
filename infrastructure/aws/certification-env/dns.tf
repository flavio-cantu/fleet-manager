# Cria a Hosted Zone
resource "aws_route53_zone" "main" {
  name = "shadowguardians.space"
}

# Cria o registro A apontando para o IP
resource "aws_route53_record" "root" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "shadowguardians.space"
  type    = "A"
  ttl     = 300
  records = [aws_instance.shadow_guardian_instance.public_ip ]
}