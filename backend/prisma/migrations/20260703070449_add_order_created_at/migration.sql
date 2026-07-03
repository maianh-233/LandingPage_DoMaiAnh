-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "Order_created_at_idx" ON "Order"("created_at");
