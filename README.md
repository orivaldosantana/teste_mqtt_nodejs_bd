# Teste com MQTT e Banco de Dados com NodeJS

Estudo de como integrar leitura de um sensor via MQTT com um banco de dados dentro de uma aplicação NodeJS.

## Criando o banco de dados

Criando um projeto NodeJS

```
npm init -y
npm install prisma --save-dev
```

Criando um projeto Prisma

```
npx prisma init
```

Mapeando o modelo de dados da aplicação para o esquema no banco de dados:

```
npx prisma migrate dev --name init
```

## Instalações de pacotes

Cliente Prisma:

```
npm install @prisma/client
```

MQTT:

```
npm install mqtt
```

Acesso ao .env

```
npm install dotenv
```

# Referências

- [ Set up Prisma - Start from scratch](https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch)
