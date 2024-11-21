import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { getCookie } from "hono/cookie";
import { db } from "../db";
import { users } from "../db/schema";
import { authMiddleware } from "../middleware/auth";
import { redisClient } from "../redis";
import type { AuthVariables } from "../middleware/auth";

const user = new Hono<AuthVariables>();

user.use("/*", authMiddleware);

user
  .get("/profile", async (c) => {
    const userId = c.get("userId");
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, Number.parseInt(userId)))
      .limit(1);

    if (!user.length) {
      return c.json({ message: "User not found" }, 404);
    }

    const { password, ...userWithoutPassword } = user[0];
    return c.json(userWithoutPassword);
  })
  .delete("/account", async (c) => {
    const userId = c.get("userId");

    await db.delete(users).where(eq(users.id, Number.parseInt(userId)));

    const sessionId = getCookie(c, "sessionId");
    if (sessionId) {
      await redisClient.del(`session:${sessionId}`);
    }

    return c.json({ message: "Account deleted successfully" });
  });

export default user;
