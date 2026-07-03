import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '../../.env') });

const envSchema = z.object({
  PORT: z.coerce.number().default(5000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  GITHUB_TOKEN: z.string().optional(),
  GITHUB_API_URL: z.string().url().default('https://api.github.com'),
  DATABASE_URL: z.string().url(),
  REQUEST_TIMEOUT: z.coerce.number().default(10000),
});

const parseResult = envSchema.safeParse(process.env);

if (!parseResult.success) {
  console.error('Invalid environment configuration:', parseResult.error.format());
  process.exit(1);
}

export const config = parseResult.data;
export type Config = typeof config;
