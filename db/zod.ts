import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { users, posts, comments, tags, posts_tags } from './schema';
import { z } from 'zod';

// Users
export const insertUserSchema = createInsertSchema(users, {
    email: () => z.email({ message: 'Invalid email address' }),
    username: (schema) => schema.min(3, { message: 'Username must be at least 3 characters' }),
    passwordHash: (schema) => schema.min(6, { message: 'Password must be at least 6 characters' })
});
export const selectUserSchema = createSelectSchema(users);

// Posts
export const insertPostSchema = createInsertSchema(posts, {
    title: (schema) => schema.min(5, { message: 'Title must be at least 5 characters' }),
    slug: (schema) => schema.min(3, { message: 'Slug must be at least 3 characters' }),
});
export const selectPostSchema = createSelectSchema(posts);

// Comments
export const insertCommentSchema = createInsertSchema(comments, {
    content: (schema => schema.min(1, { message: 'Comment cannot be empty' })),
});
export const selectCommentSchema = createSelectSchema(comments);

// Tags
export const insertTagSchema = createInsertSchema(tags, {
    name: (schema) => schema.min(2, { message: 'Tag name must be at least 2 characters' })
});
export const selectTagSchema = createSelectSchema(tags);