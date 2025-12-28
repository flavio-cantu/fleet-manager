#!/bin/bash
# install-ad-cert.sh - Baixa certificado AD e importa no Java cacerts

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

# Configurações
SERVER="ldap.domain.com.br"
PORT="636"
ALIAS="ad-curiosity"

# Verificar JAVA_HOME
if [ -z "$JAVA_HOME" ]; then
    echo -e "${RED}ERRO: JAVA_HOME não definido${NC}"
    exit 1
fi

# Caminhos
CACERTS="${JAVA_HOME}/lib/security/cacerts"
TEMP_CERT="/tmp/ad-cert-$$.pem"

# Baixar certificado
echo "Baixando certificado de ${SERVER}..."
openssl s_client -connect "${SERVER}:${PORT}" \
    -servername "$SERVER" </dev/null 2>/dev/null | \
    sed -n '/-----BEGIN CERTIFICATE-----/,/-----END CERTIFICATE-----/p' > "$TEMP_CERT"

if [ ! -s "$TEMP_CERT" ]; then
    echo -e "${RED}ERRO: Não foi possível baixar o certificado${NC}"
    exit 1
fi

# Verificar se cacerts existe
if [ ! -f "$CACERTS" ]; then
    echo -e "${RED}ERRO: cacerts não encontrado em ${CACERTS}${NC}"
    rm -f "$TEMP_CERT"
    exit 1
fi

# Importar para cacerts
echo "Importando para Java cacerts..."
sudo $JAVA_HOME/bin/keytool -import -trustcacerts \
    -alias "$ALIAS" \
    -file "$TEMP_CERT" \
    -keystore "$CACERTS" \
    -storepass changeit

# Limpar e mostrar resultado
rm -f "$TEMP_CERT"
echo -e "${GREEN}OK${NC}"