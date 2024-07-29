import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export const resolvers = {
    Query: {
        inventories: () => prisma.inventory.findMany(),
        inventory: (_: any, { id }: { id: number }) => prisma.inventory.findUnique({ where: { id } }),
    },
    Mutation: {
        createInventory: (_: any, { quantity, sku, description, store }: { quantity: number; sku: string; description?: string; store: string }) =>
            prisma.inventory.create({
                data: { quantity, sku, description, store },
            }),
        updateInventory: (_: any, { id, ...data }: { id: number; quantity?: number; sku?: string; description?: string; store?: string }) =>
            prisma.inventory.update({
                where: { id },
                data,
            }),
        deleteInventory: (_: any, { id }: { id: number }) =>
            prisma.inventory.delete({
                where: { id },
            }),
        bulkCreateInventory: async (_: any, { items }: { items: Array<Prisma.InventoryCreateInput> }) => {
            let createdCount = 0;
            for (const item of items) {
                try {
                    await prisma.inventory.create({
                        data: item,
                    });
                    createdCount++;
                } catch (error) {
                    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                        // Unique constraint violation, skip this item
                        console.log(`Skipping duplicate item with SKU: ${item.sku}`);
                    } else {
                        throw error;
                    }
                }
            }
            return createdCount;
        },
    },
};