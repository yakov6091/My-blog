import { createPost, getAllPosts, updatePost, deletePost } from '@/actions/post';

async function testCrud() {
    console.log('Testing Update and Delete Operations...\n');

    // Create a FormData object for testing
    console.log('Creating a test post...');
    const formData = new FormData();
    formData.append('title', 'Temporary Test Post');
    formData.append('slug', `test-slug-${Date.now()}`);
    formData.append('content', 'This post is created to test update and delete.');
    formData.append('userId', 'aed396ba-2738-4420-b82b-ca8f9f100aff');

    const createResult = await createPost(formData);

    if (!createResult.success) {
        console.error('❌ Failed to create test post:', createResult);
        return;
    }
    console.log('✅ Successfully created test post!\n');

    // Fetch posts to grab the new post's UUID
    const allPosts = await getAllPosts();
    if (!allPosts.success || !allPosts.data || allPosts.data.length === 0) {
        console.error('❌ No posts found');
        return;
    }

    const testPost = allPosts.data[0];
    console.log(`Targeting post ID: ${testPost.id} | Title: "${testPost.title}"\n`);

    // 2. Test Update
    console.log('Updating the test post...');
    const updateResult = await updatePost(testPost.id, {
        title: 'Updated Test Post Title',
        slug: testPost.slug,
        content: 'This content has been successfully updated.',
    });

    if (updateResult.success) {
        console.log('✅ Successfully updated post!');
    } else {
        console.error('❌ Failed to update post:', updateResult.error);
    }

    // 3. Test Delete
    console.log('\nDeleting the test post...');
    const deleteResult = await deletePost(testPost.id);

    if (deleteResult.success) {
        console.log('✅ Successfully deleted post!');
    } else {
        console.error('❌ Failed to delete post:', deleteResult.error);
    }

    console.log('\n🎉 CRUD test sequence finished successfully!');
}

testCrud();