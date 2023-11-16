//fonte https://www.emqx.com/en/blog/how-to-use-mqtt-in-nodejs
const dotenv = require('dotenv')
dotenv.config()
console.log(`MQTT Server: ${process.env.MQTT_SERVER}`)

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

console.log('Testing MQTT and Prisma!')

const mqtt = require('mqtt')

const host = process.env.MQTT_SERVER
const port = '1883'
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`

const connectUrl = `mqtt://${host}:${port}`
const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  username: `${process.env.MQTT_USER}`,
  password: `${process.env.MQTT_PASSWORD}`,
  reconnectPeriod: 1000
})

const pubTopic = 'ORIVA/casa/log'
const subTopicTemp = 'ORIVA/casa/temperatura'
const subTopicLDR = 'ORIVA/casa/luminosidade'
const subTopicHumi = 'ORIVA/casa/umidade'
client.on('connect', () => {
  console.log('Connected')
  client.subscribe([subTopicTemp, subTopicLDR, subTopicHumi], () => {
    console.log(
      `Subscribe to topics '${subTopicTemp}', '${subTopicHumi}', and '${subTopicLDR}'`
    )
  })
  client.publish(
    pubTopic,
    'Publicando do NodeJS!!',
    { qos: 0, retain: false },
    error => {
      if (error) {
        console.error(error)
      }
    }
  )
})

async function recordDataIntoBD(subTopic, data) {
  console.log(subTopic)
  let sId = 0
  if (subTopic == subTopicTemp) {
    sId = 1
  } else if (subTopic == subTopicLDR) {
    sId = 2
  } else if (subTopic == subTopicHumi) {
    sId = 5
  }
  
  if (sId == 5 || sId == 2 || sId == 1) {
    try {
      const reading = await prisma.reading.create({
        data: {
          sensorId: parseInt(sId),
          value: parseFloat(data)
        }
      })
      console.log(reading)
    } catch (error) {
      console.error(
        `Erro de escrita no banco de dados:\n Para o tópico: ${subTopic}\n${error}`
      )
    }
  }
}

client.on('message', async (subTopic, payload) => {
  console.log('Received Message:', subTopic, payload.toString())
  recordDataIntoBD(subTopic, payload.toString())
})

// Adicionando o manipulador de eventos 'beforeExit' para desconectar o Prisma antes de sair
process.on('beforeExit', async () => {
  console.log('Disconnecting Prisma before exit.')
  await prisma.$disconnect()
})
