# Teste com MQTT e Banco de Dados com NodeJS

Estudo de como realizar leituras de sensores via MQTT e gravar em banco de dados numa aplicação NodeJS.

## Organização inicial

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

- [Set up Prisma - Start from scratch](https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch)
- [Vídeo com exemplo simples sobre MQTT e NodeJS](https://youtu.be/yX6j9AmUVOA)
- [Código com exemplo simples sobre MQTT e NodeJS](https://replit.com/@orivaldosantana/testenodejsmqtt)
- [Vídeo sobre ferramenta para facilitar o uso de banco de dados na linguagem de programação NodeJS](https://youtu.be/bl2hDCdlhQ0)
