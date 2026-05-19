import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        description: z.string(),
        date: z.string(),
        updated: z.string().optional(),
        category: z.string(),
        tags: z.array(z.string()).optional().default([]),
        author: z.string().optional().default('Dinheiro na Net'),
        draft: z.boolean().optional().default(false),
    }),
});

export const collections = { posts };
