import type { Config } from "drizzle-kit";
import { env } from "./src/config/env";

export default {
  schema: "./src/db/schema.ts",
  out: "./migrations",
  driver: "pg",
  dbCredentials: {
    connectionString: env.DATABASE_URL,
  },
} satisfies Config;
