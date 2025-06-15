#!/bin/bash

# Verifica se os parâmetros necessários foram fornecidos
if [ -z "$1" ] || [ -z "$2" ]; then
  echo "Erro: Parâmetros insuficientes."
  echo "Uso: $0 <nome-do-bucket>/<bucket-path> <diretorio-do-projeto>"
  echo "Exemplo: $0 meu-bucket-s3/pasta/destino /caminho/para/projeto"
  exit 1
fi

BUCKET_PATH=$1
PROJECT_PATH=$2
ZIP_FILE="/tmp/frontend.zip"

# Verifica se o diretório existe
if [ ! -d "$PROJECT_PATH" ]; then
  echo "Erro: Diretório do projeto não encontrado: $PROJECT_PATH"
  exit 1
fi

# Navega para o diretório do projeto
cd "$PROJECT_PATH" || exit 1

npm run mock:build

echo "Comprimindo arquivos..."
# Comprime a pasta src e todos os arquivos .json e .js no diretório principal
zip -r "$ZIP_FILE" dist/ src/ public/ *.json *.js 2>/dev/null

if [ ! -f "$ZIP_FILE" ]; then
  echo "Erro: Falha ao criar o arquivo zip"
  exit 1
fi

echo "Enviando para o S3..."
# Envia o arquivo zip para o S3
aws s3 cp "$ZIP_FILE" "s3://$BUCKET_PATH/"

if [ $? -eq 0 ]; then
  echo "Upload realizado com sucesso para s3://$BUCKET_PATH/$(basename "$ZIP_FILE")"
else
  echo "Erro: Falha no upload para o S3"
  exit 1
fi

# Remove o arquivo zip temporário
rm -f "$ZIP_FILE"

rm -f dist

echo "Processo concluído."