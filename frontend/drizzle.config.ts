import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

const POSTGRES_URL = process.env.POSTGRES_URL;

if (!POSTGRES_URL) {
  throw new Error("POSTGRES_URL is not set");
}

config({ path: ".env" });

export default defineConfig({
  schema: "./server/db/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: POSTGRES_URL,
  },
});
