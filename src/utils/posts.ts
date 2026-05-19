// src/utils/posts.ts
// Helper utilities for Content Collections posts (Astro v6)

import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

/** Returns the URL-safe slug for a post (strips .mdx extension from id) */
export function slugFromPost(post: Post): string {
    return post.id.replace(/\.mdx?$/, '');
}

/** Returns the full URL path for a post */
export function postUrl(post: Post): string {
    return `/posts/${slugFromPost(post)}`;
}

/** Returns all published (non-draft) posts sorted by date descending */
export async function getPublishedPosts(): Promise<Post[]> {
    const posts = await getCollection('posts', ({ data }) => !data.draft);
    return sortPostsByDate(posts);
}

/** Sorts posts by date descending (newest first) */
export function sortPostsByDate(posts: Post[]): Post[] {
    return [...posts].sort(
        (a, b) => new Date(b.data.date).valueOf() - new Date(a.data.date).valueOf()
    );
}

/** Filters posts by category name */
export function getPostsByCategory(posts: Post[], category: string): Post[] {
    return posts.filter((p) => p.data.category === category);
}

/** Formats a date string to pt-PT locale */
export function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('pt-PT', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}
