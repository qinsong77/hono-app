import { createMiddleware } from "hono/factory";
import { getCookie } from "hono/cookie";
import { redisClient } from "@/redis";

// 定义中间件变量类型
export type AuthVariables = {
  Variables: {
    userId: string; // 确保与 Redis 返回的类型匹配
  };
};

export const authMiddleware = createMiddleware<AuthVariables>(
  async (c, next) => {
    const sessionId = getCookie(c, "sessionId");

    if (!sessionId) {
      return c.json({ message: "Unauthorized" }, 401);
    }

    const userId = await redisClient.get(`session:${sessionId}`);
    if (!userId) {
      return c.json({ message: "Unauthorized" }, 401);
    }

    c.set("userId", userId);
    await next();
  }
);
