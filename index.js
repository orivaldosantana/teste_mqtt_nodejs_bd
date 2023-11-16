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
client.on('connect', () => {
  console.log('Connected')
  client.subscribe([subTopicTemp, subTopicLDR], () => {
    console.log(`Subscribe to topics '${subTopicTemp}' and '${subTopicLDR}'`)
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
  if (subTopic == subTopicTemp) {
    const reading = await prisma.reading.create({
      data: {
        sensorId: 1,
        value: parseFloat(data)
      }
    })
    console.log(reading)
  } else if (subTopic == subTopicLDR) {
    const reading = await prisma.reading.create({
      data: {
        sensorId: 2,
        value: parseFloat(data)
      }
    })
    console.log(reading)
  }
}

client.on('message', async (subTopic, payload) => {
  console.log('Received Message:', subTopic, payload.toString())
  recordDataIntoBD(subTopic, payload.toString())
    .then(async () => {
      await prisma.$disconnect()
    })
    .catch(async e => {
      console.error(e)
      await prisma.$disconnect()
      process.exit(1)
    })
})
