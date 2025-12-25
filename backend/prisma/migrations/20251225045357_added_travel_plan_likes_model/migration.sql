-- CreateTable
CREATE TABLE "travel_plan_likes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "travelPlanId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "travel_plan_likes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "travel_plan_likes_userId_travelPlanId_key" ON "travel_plan_likes"("userId", "travelPlanId");

-- AddForeignKey
ALTER TABLE "travel_plan_likes" ADD CONSTRAINT "travel_plan_likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "travel_plan_likes" ADD CONSTRAINT "travel_plan_likes_travelPlanId_fkey" FOREIGN KEY ("travelPlanId") REFERENCES "travel_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;
