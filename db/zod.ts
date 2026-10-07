import { createInsertSchema, CreateInsertSchema, createSelectSchema } from "drizzle-zod";
import { users, posts, comments, tags } from './schema';
import { z } from 'zod';

export const insertUserSchema = createInsertSchema(users, {
    email: (schema) => schema.email({ message: 'Invalid email address' }),
    username: (schema) => schema.min(3, { message: 'Username must be at least 3 characters' }),
});