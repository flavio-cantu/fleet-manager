# 1. Hosted Zone para shadowguardians.space
resource "aws_route53_zone" "main" {
  name = "shadowguardians.space"
}

# 2. Traffic Policy (Exemplo: Failover entre EC2 em regiões diferentes)
resource "aws_route53_traffic_policy" "simple_ip_ec2" {
  name     = "shadowguardians-simple-ip-policy"
  document = jsonencode({
    AWSPolicyFormatVersion = "2015-10-01"
    RecordType             = "A"
    StartEndpoint          = "ec2-endpoint"  # Nome do endpoint definido abaixo
    Endpoints = {
      "ec2-endpoint" = {
        Type  = "value",
        Value = aws_instance.shadow_guardian_instance.public_ip 
      }
    }
  })
}

# 3. Policy Record (Aplica a Traffic Policy à Hosted Zone)
resource "aws_route53_traffic_policy_instance" "main" {
  name                   = "shadowguardians.space" 
  traffic_policy_id      = aws_route53_traffic_policy.simple_ip_ec2.id
  traffic_policy_version = aws_route53_traffic_policy.simple_ip_ec2.version
  hosted_zone_id         = aws_route53_zone.main.zone_id
  ttl                    = 300
}