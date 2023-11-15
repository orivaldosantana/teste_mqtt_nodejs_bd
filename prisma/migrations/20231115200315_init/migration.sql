-- CreateTable
CREATE TABLE "Reading" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "value" DOUBLE PRECISION NOT NULL,
    "sensorId" INTEGER NOT NULL,

    CONSTRAINT "Reading_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sensor" (
    "id" SERIAL NOT NULL,
    "location" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT,

    CONSTRAINT "Sensor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Sensor_code_key" ON "Sensor"("code");

-- AddForeignKey
ALTER TABLE "Reading" ADD CONSTRAINT "Reading_sensorId_fkey" FOREIGN KEY ("sensorId") REFERENCES "Sensor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
