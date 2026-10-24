import { db } from './index';
import { users } from './schema';

async function testConnection() {
    try {
        console.log('Testing database connection...');
        const allUsers = await db.select().from(users);
        console.log('✅ Success! Connected to Neon DB.');
        console.log('Users found:', allUsers);
    } catch (error) {
        console.error('❌ Connection failed:', error);
    }
}

testConnection();