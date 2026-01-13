# ==========================================
# BUILD
# ==========================================
# Escolhi a versão 24 do Node (versões pares são as estáveis,
# e esta é última delas); a versão trixie do Debian  (última
# versão estável LTS); slim para ser leve. Não testei alpine,
# mas talvez pudesse servir. Daí 24-trixie-slim.
#
# Esse é um Dockerfile multi-stage. No estágio de BUILD ele
# vai usar a imagem base do Node para buildar a aplicação.
# Instalando tudo o que for necessário para isso.
# Mas depois, no estágio de PRODUCTION, vai "recomeçar  o
# processo todo" e apenas copiar o que foi buildado. Dessa
# forma não teria nenhum vestígio do código fonte na máquina
# de produção (ou de seus comentários no caso do TS <> JS) e
# nem ferramentas de desenvolvimento. Isso reduz a possibilidade
# de escalar privilegios em uma invasão (nao tem git para clonar
# exploits ou npm para baixar pacotes maliciosos) e reduz a
# chance de vazamentos (segurança). Como ele também instala
# apenas o necessário para produção, a imagem final tende a ser
# mais leve (ex.: sem cache npm, sem pacotes devDependencies...).
# Esse AS builder diz que essa primeira será jogada fora ao final
# do processo, mantendo apenas a iniciada no segundo FROM.
FROM node:24-trixie-slim AS builder

# Diretório de trabalho dentro do container
WORKDIR /app

# Arquivos de dependência (primeira posicao para aproveitar cache)
COPY package*.json ./

# Instala TODAS as dependências (incluindo devDependencies para compilar o TS)
RUN npm install

# Copia o resto do código fonte
COPY . .

# Compila o TypeScript (gera a pasta /dist)
RUN npm run build

# ==========================================
# PRODUCTION
# ==========================================
FROM node:24-trixie-slim

WORKDIR /app

# Arquivos de dependência (primeira posicao para aproveitar cache)
COPY package*.json ./

# Instala APENAS dependências de produção nesta aqui (mais leve e seguro)
RUN npm install --only=production

# Copia apenas a pasta 'dist' gerada no estágio anterior
COPY --from=builder /app/dist ./dist

# Expõe a porta que a aplicação usa
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "start"]