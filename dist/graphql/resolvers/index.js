"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.resolvers = {
    Query: {
        inventories: () => prisma.inventory.findMany(),
        inventory: (_, { id }) => prisma.inventory.findUnique({ where: { id } }),
    },
    Mutation: {
        createInventory: (_, { quantity, sku, description, store }) => prisma.inventory.create({
            data: { quantity, sku, description, store },
        }),
        updateInventory: (_, { id, ...data }) => prisma.inventory.update({
            where: { id },
            data,
        }),
        deleteInventory: (_, { id }) => prisma.inventory.delete({
            where: { id },
        }),
        bulkCreateInventory: async (_, { items }) => {
            let createdCount = 0;
            for (const item of items) {
                try {
                    await prisma.inventory.create({
                        data: item,
                    });
                    createdCount++;
                }
                catch (error) {
                    if (error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                        // Unique constraint violation, skip this item
                        console.log(`Skipping duplicate item with SKU: ${item.sku}`);
                    }
                    else {
                        throw error;
                    }
                }
            }
            return createdCount;
        },
    },
};
