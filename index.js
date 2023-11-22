const ss = require('simple-statistics')
//fonte https://www.emqx.com/en/blog/how-to-use-mqtt-in-nodejs
const dotenv = require('dotenv')
dotenv.config()
console.log(`MQTT Server: ${process.env.MQTT_SERVER}`)

// Arquivo temporário para guardar as leituras intermediárias dos sensores
const tempReadings = []
const ldrReadings = []
const humiReadings = []
var readingsCounter = 0
var initialTimer = Date.now()
var finalTimer = Date.now()
const maxTimeReadings = 11 * 60 * 1000 // 11 minutos

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

async function sensorReadings(subTopic, data) {
  console.log(subTopic)
  finalTimer = Date.now()
  //let sId = 0
  if (subTopic == subTopicTemp) {
    readingsCounter++
    tempReadings.push(parseFloat(data))
    //sId = 1
  } else if (subTopic == subTopicLDR) {
    //sId = 2
    ldrReadings.push(parseFloat(data))
  } else if (subTopic == subTopicHumi) {
    //sId = 5
    humiReadings.push(parseFloat(data))
  }
  if (readingsCounter > 9) {
    console.log('LDR Readings: ' + ldrReadings)
    readingsCounter = 0
    console.log((finalTimer - initialTimer) / 1000)
    initialTimer = Date.now()

    recordDataIntoBD(1, ss.median(tempReadings))
    recordDataIntoBD(2, ss.median(ldrReadings))
    recordDataIntoBD(5, ss.median(humiReadings))

    console.log('Median: ' + ss.median(ldrReadings))
    tempReadings.length = 0
    ldrReadings.length = 0
    humiReadings.length = 0
  }
}

async function recordDataIntoBD(id, value) {
  try {
    const reading = await prisma.reading.create({
      data: {
        sensorId: parseInt(id),
        value: parseFloat(value)
      }
    })
    console.log(reading)
  } catch (error) {
    console.error(
      `Erro de escrita no banco de dados:\n Para o sensor: ${id}\n${error}`
    )
  }
}

client.on('message', async (subTopic, payload) => {
  console.log('Received Message:', subTopic, payload.toString())
  //recordDataIntoBD(subTopic, payload.toString())
  sensorReadings(subTopic, payload.toString())
})

// Adicionando o manipulador de eventos 'beforeExit' para desconectar o Prisma antes de sair
process.on('beforeExit', async () => {
  console.log('Disconnecting Prisma before exit.')
  await prisma.$disconnect()
})
