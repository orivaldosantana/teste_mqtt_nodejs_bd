const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  const reading = await prisma.reading.create({
    data: {
      sensorId: 3,
      value: 2000
    }
  })
  console.log(reading)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async e => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
