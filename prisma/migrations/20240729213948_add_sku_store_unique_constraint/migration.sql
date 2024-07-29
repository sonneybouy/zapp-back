/*
  Warnings:

  - A unique constraint covering the columns `[sku,store]` on the table `Inventory` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Inventory_sku_key";

-- CreateIndex
CREATE UNIQUE INDEX "Inventory_sku_store_key" ON "Inventory"("sku", "store");
