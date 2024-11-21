import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { env } from '@/config/env';
import * as schema from "./schema";

const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

// 初始化 drizzle
export const db = drizzle(pool, { schema });

const result = await db.execute("select 1");
console.log("connected: ", result);
