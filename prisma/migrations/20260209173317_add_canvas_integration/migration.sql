-- AlterTable
ALTER TABLE "CalendarEvent" ADD COLUMN     "canvasId" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "canvasAccessToken" TEXT,
ADD COLUMN     "canvasInstitutionId" TEXT,
ADD COLUMN     "canvasRefreshToken" TEXT,
ADD COLUMN     "canvasTokenExpiry" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "CanvasInstitution" (
    "id" TEXT NOT NULL,
    "baseUrl" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "clientSecret" TEXT NOT NULL,

    CONSTRAINT "CanvasInstitution_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CanvasInstitution_baseUrl_key" ON "CanvasInstitution"("baseUrl");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_canvasInstitutionId_fkey" FOREIGN KEY ("canvasInstitutionId") REFERENCES "CanvasInstitution"("id") ON DELETE SET NULL ON UPDATE CASCADE;
