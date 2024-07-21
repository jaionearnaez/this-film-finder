import { z } from 'zod';

export const authSchema = z.object({
  token: z.string(),
});

export const healthcheckSchema = z.object({
  contentful: z.boolean(),
});

export const genreSchema = z.object({
  id: z.string(),
  title: z.string(),
  movies: z.array(
    z.object({
      id: z.string(),
    })
  ),
});
export type GenreSchema = z.infer<typeof genreSchema>

export const moviesByGenreSechma = z.object({
  data: z.array(genreSchema),
  totalPages: z.number().int(),
});

export type MoviesByGenre = z.infer<typeof moviesByGenreSechma>;

export const movieSchema = z.object({
  id: z.string(),
  title: z.string(),
  posterUrl: z.string().url().nullable().optional().default(null),
  rating: z.string().nullable().optional().default(null),
});

export type Movie = z.infer<typeof movieSchema>;

export const moviesResponseSchema = z.object({
  data: z.array(movieSchema).nullable().optional().default(null),
  totalPages: z.number().int(),
});

export type MoviesResponse = z.infer<typeof moviesResponseSchema>;

export const titleSchema = z.object({
  id: z.string(),
  title: z.string(),
});

export type TitleId = z.infer<typeof titleSchema>;

export const movieDetailSchema = z.object({
  id: z.string(),
  title: z.string(),
  posterUrl: z.string().url().nullable().optional().default(null),
  rating: z.string().nullable().optional().default(null),
  summary: z.string().nullable().optional().default(null),
  duration: z.string().nullable().optional().default(null), // You can add additional validation for ISO 8601 duration if necessary
  directors: z.array(z.string()).nullable().optional().default(null),
  mainActors: z.array(z.string()).nullable().optional().default(null),
  datePublished: z
    .string()
    .nullable()
    .optional()
    .default(null)
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: 'Invalid date format',
    }),
  ratingValue: z.number().nullable().optional().default(null),
  bestRating: z.number().nullable().optional().default(null),
  worstRating: z.number().nullable().optional().default(null),
  writers: z.array(z.string()).nullable().optional().default(null),
  genres: z.array(titleSchema).nullable().optional().default(null),
});

export type MovieDetail = z.infer<typeof movieDetailSchema>;

export const movieTitlesResponseSchema = z.object({
  data: z.array(titleSchema),
  totalPages: z.number().int(),
});

export type MovieTitlesResponse = z.infer<typeof movieTitlesResponseSchema>;

export const genreDetailSchema = z.object({
  id: z.string(),
  title: z.string(),
  totalMovies: z.number(),
});

export type GenreDetail = z.infer<typeof genreDetailSchema>;
