"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const apollo_server_express_1 = require("apollo-server-express");
const cors_1 = __importDefault(require("cors"));
const multer_1 = __importDefault(require("multer"));
const schema_1 = require("../graphql/schema");
const resolvers_1 = require("../graphql/resolvers");
const csvParser_1 = require("../utils/csvParser");
const client_1 = require("@prisma/client");
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
app.post('/upload-csv', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    try {
        const parsedData = await (0, csvParser_1.parseCSV)(req.file.buffer);
        let createdCount = 0;
        for (const item of parsedData) {
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
        res.json({ message: 'CSV data imported successfully', count: createdCount });
    }
    catch (error) {
        console.error('Error processing CSV:', error);
        res.status(500).json({ error: 'Failed to process CSV file' });
    }
});
const server = new apollo_server_express_1.ApolloServer({
    typeDefs: schema_1.typeDefs,
    resolvers: resolvers_1.resolvers,
});
async function startApolloServer() {
    await server.start();
    server.applyMiddleware({ app: app }); // Type assertion to bypass strict checking
}
startApolloServer();
exports.default = app;
