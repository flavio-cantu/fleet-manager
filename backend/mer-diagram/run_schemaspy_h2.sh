#!/bin/bash

export JAVA_HOME=/home/dev/.jdks/ms-21.0.7

CURRENT_PATH=$(pwd)
# Inicia o container PostgreSQL e captura o ID
CONTAINER_ID=$(docker run -d --name postgres \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=admin \
  -e POSTGRES_DB=pocgpf \
  -p 5432:5432 \
  -e POSTGRES_CONFIG_ARGS="-c listen_addresses='*'" \
  -v "$(pwd):/schemaspy" \
  postgres:latest)

echo "Container PostgreSQL iniciado com ID: $CONTAINER_ID"

# Aguarda o PostgreSQL estar pronto para aceitar conexões
echo "Aguardando PostgreSQL inicializar..."
sleep 20  # Ajuste este tempo conforme necessário

cd ..
# Executa a aplicação Maven
#mvn exec:java -Dexec.mainClass="br.com.cantu.myapp.AppCreatingMer"
./mvnw test -Dtest=br.com.cantu.myapp.AppCreatingMer

cd $CURRENT_PATH
# Executa o SchemaSpy
$JAVA_HOME/bin/java -jar schemaspy-6.2.4.jar -configFile schemaspy.properties

# Para e remove o container
docker stop $CONTAINER_ID
docker rm $CONTAINER_ID
echo "Container PostgreSQL removido"