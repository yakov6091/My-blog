import { createPost } from '@/actions/post';
import { revalidatePath } from 'next/cache';

async function testPostCreation() {
    console.log('Testing createPost Server Action...');

    const formData = new FormData();
    formData.append('title', 'My first test blog psot' + Date.now());
    formData.append('slug', 'my first test blog psot-slug2' + Date.now());
    formData.append('content', 'This is the rich markdown content of my very first post!');
    formData.append('userId', 'aed396ba-2738-4420-b82b-ca8f9f100aff');

    const result = await createPost(formData);

    if (result.success) {
        console.log('✅ Success! Post created and saved to Neon DB.');
    } else {
        console.error('❌ Post creation failed:', result.errors || result.error);
    }
};

testPostCreation();