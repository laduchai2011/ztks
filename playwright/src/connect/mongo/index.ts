import { MongoClient, Db } from 'mongodb';
import { mongo_config } from '@src/config';

const MONGO_URI = `mongodb://${mongo_config?.username}:${mongo_config?.password}@${mongo_config?.host}:${mongo_config?.port}/${mongo_config?.database}?authSource=admin`;
const DB_NAME = mongo_config?.database;

let client: MongoClient | null = null;
let db: Db | null = null;

export async function connectMongo(): Promise<Db> {
    if (db) {
        return db;
    }

    if (!client) {
        client = new MongoClient(MONGO_URI);
        await client.connect();
    }

    db = client.db(DB_NAME);
    console.log('✅ MongoDB connected');

    return db;
}

export function getDbMonggo(): Db {
    if (!db) {
        throw new Error('MongoDB not connected. Call connectMongo() first.');
    }
    return db;
}
