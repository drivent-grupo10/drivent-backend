-- CreateTable
CREATE TABLE "ActivitiesBook" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "activitieId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ActivitiesBook_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ActivitiesBook_userId_key" ON "ActivitiesBook"("userId");

-- AddForeignKey
ALTER TABLE "ActivitiesBook" ADD CONSTRAINT "ActivitiesBook_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivitiesBook" ADD CONSTRAINT "ActivitiesBook_activitieId_fkey" FOREIGN KEY ("activitieId") REFERENCES "Activities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
