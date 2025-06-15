#!/bin/bash

# Verifica se os parâmetros necessários foram fornecidos
if [ -z "$1" ] || [ -z "$2" ]; then
  echo "Erro: Parâmetros insuficientes."
  echo "Uso: $0 <nome-do-bucket>/<bucket-path> <diretorio-do-projeto>"
  echo "Exemplo: $0 meu-bucket-s3/pasta/destino /caminho/para/arquivo"
  exit 1
fi

BUCKET_PATH=$1
CONFIG_PATH=$2


echo "Enviando para o S3..."
# Envia o arquivo zip para o S3
aws s3 cp "$CONFIG_PATH" "s3://$BUCKET_PATH"

if [ $? -eq 0 ]; then
  echo "Upload realizado com sucesso para s3://$BUCKET_PATH"
else
  echo "Erro: Falha no upload para o S3"
  exit 1
fi


echo "Processo concluído."