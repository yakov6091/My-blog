import * as dotenv from 'dotenv';

// Load .env.local for drizzle-kit CLI commands
dotenv.config({ path: '.env.local' });

export default {
    schema: './db/schema.ts',
    out: './drizzle',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
};