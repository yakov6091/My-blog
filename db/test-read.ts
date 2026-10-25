import { getAllPosts, getPostBySlug } from '@/actions/post';

async function testReadOperations() {
    console.log('Testing Read Operations...\n');

    // 1. Test fetching all posts
    console.log('Fetching all posts...');
    const allPostsResult = await getAllPosts();

    if (allPostsResult.success && allPostsResult.data) {
        console.log(`✅ Successfully fetched ${allPostsResult.data.length} post(s):`);
        allPostsResult.data.forEach((post, index) => {
            console.log(`   [${index + 1}] Title: "${post.title}" | Slug: "${post.slug}"`);
        });

        // Pick the first post's slug to test single-post fetching
        if (allPostsResult.data.length > 0) {
            const sampleSlug = allPostsResult.data[0].slug;
            console.log(`\nTesting getPostBySlug with slug: "${sampleSlug}"...`);

            const singlePostResult = await getPostBySlug(sampleSlug);
            if (singlePostResult.success && singlePostResult.data) {
                console.log(`✅ Successfully fetched single post:`);
                console.log(`   Title: ${singlePostResult.data.title}`);
                console.log(`   Content: ${singlePostResult.data.content}`);
            } else {
                console.error(`❌ Failed to fetch single post:`, singlePostResult.error);
            }
        }
    } else {
        console.error('❌ Failed to fetch posts:', allPostsResult.error);
    }
}

testReadOperations();