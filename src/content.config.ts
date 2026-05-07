import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const cover = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/cover" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      dedication: z.string(),
      photo: image().optional(),
      photoTilt: z.number().default(-2),
    }),
});

const lessons = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/lessons" }),
  schema: z.object({
    title: z.string(),
    order: z.number(),
    accent: z.enum(["yellow", "blue", "rose", "sage"]).default("yellow"),
  }),
});

const memories = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/memories" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      era: z.enum(["childhood", "early-motherhood", "growing-up", "recent"]),
      order: z.number(),
      photo: image(),
      photoCaption: z.string(),
      layout: z.enum(["left", "right", "full"]).default("left"),
    }),
});

const gallery = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/gallery" }),
  schema: ({ image }) =>
    z.object({
      label: z.string(),
      chapter: z.string(),
      order: z.number(),
      photos: z.array(
        z.object({
          src: image(),
          caption: z.string(),
          year: z.string().optional(),
          tape: z.enum(["yellow", "blue", "rose"]).optional(),
          tilt: z.number().default(0),
        }),
      ),
    }),
});

const voices = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/voices" }),
  schema: z.object({
    title: z.string(),
    order: z.number(),
    audio: z.string(),
    duration: z.string(),
    side: z.enum(["A", "B"]).default("A"),
    recordedOn: z.string().optional(),
  }),
});

const letter = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/letter" }),
  schema: z.object({
    closing: z.string(),
  }),
});

export const collections = { cover, lessons, memories, gallery, voices, letter };
