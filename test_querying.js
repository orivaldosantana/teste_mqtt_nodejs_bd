const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  const sensor = await prisma.sensor.create({
    data: {
      location: 'casa',
      name: 'Iluminação',
      code: 'LDR02',
      readings: {
        create: {
          value: 2000
        }
      }
    }
  })
  console.log(sensor)
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
