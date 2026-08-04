import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

/**
 * Pages
 * - Markdown で書ける固定ページ
 * - ファイルの相対パスがそのまま URL になる
 *   例) works/geolonia.md -> /works/geolonia/
 *       programmings.md   -> /programmings/
 */
export const pages = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/pages" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),

    // トップページ等での並び順(任意)
    order: z.number().optional(),

    // アイキャッチ
    hero_image: z.string().optional(),

    updated: z.string().optional(),

    // 下書き・非公開
    draft: z.boolean().optional().default(false),
  }),
});

/**
 * OSS presentations
 * - 発表ページ。Markdown に longitude / latitude を入れると
 *   /oss/ の MapLibre 地図にマーカーとして出る。
 *   例) foss4g-2023.md   -> /oss/foss4g-2023/
 *       osc-2026-kyoto.md -> /oss/osc-2026-kyoto/
 */
export const oss = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/oss" }),
  schema: z.object({
    title: z.string(),

    // イベント名・会場・日付など
    event: z.string().optional(),
    location: z.string().optional(),
    date: z.string().optional(),

    // 地図用(/oss)
    latitude: z.number().optional(),
    longitude: z.number().optional(),

    // 関連リンク
    url: z.string().url().optional(),
    slides: z.string().url().optional(),

    hero_image: z.string().optional(),

    // 下書き・非公開
    draft: z.boolean().optional().default(false),
  }),
});

export const collections = { pages, oss };
