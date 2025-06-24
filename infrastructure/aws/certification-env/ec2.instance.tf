
#EC2 BASE IMAGE =============
data "aws_ami" "ec2_base_image" {
  most_recent = true

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-focal-20.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }

  owners = ["099720109477"]
}

#EC2 Inscante =============
resource "aws_instance" "shadow_guardian_instance" {
  ami           = data.aws_ami.ec2_base_image.id
  instance_type = "t2.micro"
  #instance_type          = "t2.medium"
  vpc_security_group_ids = [aws_security_group.concept-project_sg.id]
  iam_instance_profile   = aws_iam_instance_profile.profile_para_ec2.name # Anexa o perfil
  tags = merge(
    local.common_tags,
    { "Name" = "shadow-guardian-app" }
  )
  depends_on = [
    null_resource.upload_angular_app
  ]
  #Logfile: tail -f /var/log/cloud-init-output.log
  user_data = <<-EOF
            #cloud-config
            package_update: true
            packages:
                - unzip
                - nginx
                - awscli
            write_files:
              - path: /etc/environment
                content: |
                  AWS_REGION=${data.aws_region.current.name}
                  NG_CLI_ANALYTICS=false
              - path: /scripts/bkp.sh
                permissions: '0755'
                content: |
                  #!/bin/bash
                  aws s3 cp /app/db.json s3://${aws_s3_bucket.bucket-shadow_guardian.bucket}/db.json
              - path: /scripts/get_ip.sh
                permissions: '0755'
                content: |
                  #!/bin/bash
                  rm /app/json-server-confg.json
                  IP=$(curl -s https://checkip.amazonaws.com)
                  URL="http://$IP:3000"
                  echo $URL
                  echo "{\"path\": \"$URL\"}" > /app/json-server-confg.json
              - path: /scripts/setup_node.sh
                permissions: '0755'
                content: |
                  #!/bin/bash
                  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
                  export NVM_DIR="$HOME/.nvm"
                  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # Carrega o nvm
                  [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # Carrega completions
                  nvm install 24.1.0
                  cd /app
                  npm install
                  mv /app/dist/frontend/browser/* /usr/share/nginx/html
                  chmod 777 -R /usr/share/nginx/html
                  npm run mock:server > /app/server.log &
            runcmd:
              - source /etc/environment
              - while [ ! -f /usr/bin/aws ]; do sleep 2; done
              - aws s3 cp s3://${aws_s3_bucket.bucket-shadow_guardian.bucket}/app /app --recursive
              - aws s3 cp s3://${aws_s3_bucket.bucket-shadow_guardian.bucket}/nginx/default.conf /etc/nginx/sites-available/default
              - unzip -o /app/frontend.zip -d /app
              - rm /app/frontend.zip
              - aws s3 cp s3://${aws_s3_bucket.bucket-shadow_guardian.bucket}/db.json /app/db.json
              - /scripts/get_ip.sh
              - /scripts/setup_node.sh
              - /etc/init.d/nginx restart
            EOF
}

# EC2 Security Group =========
resource "aws_security_group" "concept-project_sg" {
  name        = "shadow_guardian-ssh-http"
  description = "Acesso SSH e HTTP para instancia da shadow_guardian"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # Meu IP atual
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # Meu IP atual
  }

  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # Para acesso ao Json-server
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(
    local.common_tags,
    { "Name" = "shadow_guardian_SG" }
  )
}

#EC2 Role permissions
# 1. Role (papel) com permissão para ler do S3
resource "aws_iam_role" "role_para_ec2" {
  name = "shadow_guardian-ec2-access-s3"

  # Define que a Role pode ser assumida pela EC2
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Action    = "sts:AssumeRole",
      Effect    = "Allow",
      Principal = { Service = "ec2.amazonaws.com" }
    }]
  })
}

# 2. Política de permissão para ler o bucket específico
resource "aws_iam_role_policy" "permissao_s3" {
  name = "permission-shadow_guardian-ec2-read-s3"
  role = aws_iam_role.role_para_ec2.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Action = ["s3:ListBucket", "s3:GetObject", "s3:PostObject", "s3:PutObject"],
      Effect = "Allow",
      Resource = [
        "${aws_s3_bucket.bucket-shadow_guardian.arn}",
        "${aws_s3_bucket.bucket-shadow_guardian.arn}/*"
      ]
    }]
  })
}

# 3. Instance Profile (associa a Role à EC2)
resource "aws_iam_instance_profile" "profile_para_ec2" {
  name = "shadow_guardian-ec2-s3"
  role = aws_iam_role.role_para_ec2.name
}
