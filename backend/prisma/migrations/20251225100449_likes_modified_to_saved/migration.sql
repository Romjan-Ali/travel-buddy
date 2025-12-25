/*
  Warnings:

  - You are about to drop the `travel_plan_likes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "travel_plan_likes" DROP CONSTRAINT "travel_plan_likes_travelPlanId_fkey";

-- DropForeignKey
ALTER TABLE "travel_plan_likes" DROP CONSTRAINT "travel_plan_likes_userId_fkey";

-- DropTable
DROP TABLE "travel_plan_likes";

-- CreateTable
CREATE TABLE "saved_travel_plans" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "travelPlanId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "saved_travel_plans_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "saved_travel_plans_userId_travelPlanId_key" ON "saved_travel_plans"("userId", "travelPlanId");

-- AddForeignKey
ALTER TABLE "saved_travel_plans" ADD CONSTRAINT "saved_travel_plans_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_travel_plans" ADD CONSTRAINT "saved_travel_plans_travelPlanId_fkey" FOREIGN KEY ("travelPlanId") REFERENCES "travel_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;
