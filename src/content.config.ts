import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
    loader: glob({ pattern: '**/*.mdx', base: './src/content/posts' }),
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
