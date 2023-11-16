const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function createReading() {
  try {
    const reading = await prisma.reading.create({
      data: {
        sensorId: 3,
        value: 2000
      }
    })
    console.log(reading)
  } catch (error) {
    console.log(error)
  }
}

async function createSensor() {
  try {
    const sensor = await prisma.sensor.create({
      data: {
        location: 'casa',
        name: 'Umidade do ar',
        code: 'UMI01'
      }
    })
    console.log(sensor)
  } catch (error) {
    console.log(error)
  }
}

//createReading()
createSensor()

prisma.$disconnect()
