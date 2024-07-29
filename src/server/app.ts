import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import multer from 'multer';
import { typeDefs } from '../graphql/schema';
import { resolvers } from '../graphql/resolvers';
import { parseCSV } from '../utils/csvParser';
import {Prisma, PrismaClient} from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

app.post('/upload-csv', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
        const parsedData = await parseCSV(req.file.buffer);
        let createdCount = 0;
        for (const item of parsedData) {
            try {
                await prisma.inventory.create({
                    data: item,
                });
                createdCount++;
            } catch (error) {
                if (error instanceof Prisma.PrismaClientKnownRequestError) {
                    if (error.code === 'P2002') {
                        console.log(`Skipping duplicate item with SKU: ${item.sku}`);
                    } else {
                        console.error('Prisma error:', error.message, error.code);
                    }
                } else {
                    console.error('Unknown error:', error);
                }
            }
        }

        res.json({ message: 'CSV data imported successfully', count: createdCount });
    } catch (error) {
        console.error('Error processing CSV:', error);
        res.status(500).json({ error: 'Failed to process CSV file', details: error.message });
    }
});

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

async function startApolloServer() {
    await server.start();
    server.applyMiddleware({ app: app as any }); // Type assertion to bypass strict checking
}

startApolloServer();

export default app;