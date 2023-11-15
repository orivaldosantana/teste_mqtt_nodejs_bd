//fonte https://www.emqx.com/en/blog/how-to-use-mqtt-in-nodejs
const dotenv = require('dotenv')
dotenv.config()
console.log(`MQTT Server: ${process.env.MQTT_SERVER}`)

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
const subTopic = 'ORIVA/casa/temperatura'
client.on('connect', () => {
  console.log('Connected')
  client.subscribe([subTopic], () => {
    console.log(`Subscribe to topic '${subTopic}'`)
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

client.on('message', (subTopic, payload) => {
  console.log('Received Message:', subTopic, payload.toString())
})
