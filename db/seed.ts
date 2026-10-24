import { db } from './index';
import { users } from './schema';

async function seed() {
    try {
        console.log('Seeding test user...');

        // Insert a dummy user
        const [newUser] = await db
            .insert(users)
            .values({
                username: 'test_author',
                email: 'author@test.com',
                passwordHash: 'fake_hash_for_testing',
            })
            .returning();

        console.log('✅ Success! Created test user with ID:', newUser.id);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
    }
}
seed();