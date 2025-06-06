import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: '.env.local' })

export default defineConfig({
  out: './drizzle',
  schema: './database/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
