import { pgTable, uuid, varchar, text, timestamp, primaryKey } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    username: varchar('username', { length: 50 }).notNull().unique(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    passwordHash: text('password_hash').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const posts = pgTable('posts', {
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    id: uuid('id').primaryKey().defaultRandom(),
    title: varchar('title', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).notNull().unique(),
    content: text('content').notNull(),
    imageUrl: text('image_url'),
    createdAt: timestamp('created_at').defaultNow().notNull()
});

export const comments = pgTable('comments', {
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    postId: uuid('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
    id: uuid('id').primaryKey().defaultRandom(),
    content: text('content').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull()
});

export const tags = pgTable('tags', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 50 }).unique().notNull(),
});

export const posts_tags = pgTable('posts_tags', {
    tagId: uuid('tag_id').notNull().references(() => tags.id, { onDelete: 'cascade' }),
    postId: uuid('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
}, (table) => ([
    primaryKey({ columns: [table.postId, table.tagId] })
]));

// Relations

// User Relations
export const usersRelations = relations(users, ({ many }) => ({
    posts: many(posts),
    comments: many(comments),
}));

// Post Relations
export const postsRelations = relations(posts, ({ one, many }) => ({
    author: one(users, {
        fields: [posts.userId],
        references: [users.id],
    }),
    comments: many(comments),
    postTags: many(posts_tags),
}));

// Comment Relations
export const commentsRelations = relations(comments, ({ one }) => ({
    user: one(users, {
        fields: [comments.userId],
        references: [users.id],
    }),
    post: one(posts, {
        fields: [comments.postId],
        references: [posts.id]
    }),
}));

// Tag Relations
export const tagsRelations = relations(tags, ({ many }) => ({
    postsTags: many(posts_tags)
}));

// Junction Table Relations (Many-to-Many bridge)
export const postsTagsRelations = relations(posts_tags, ({ one }) => ({
    post: one(posts, {
        fields: [posts_tags.postId],
        references: [posts.id],
    }),
    tag: one(tags, {
        fields: [posts_tags.tagId],
        references: [tags.id],
    }),
}));