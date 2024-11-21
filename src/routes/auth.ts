import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { db } from "../db";
import { users } from "../db/schema";
import { redisClient } from "../redis";
import { generateSessionId, hashPassword, verifyPassword } from "../utils/auth";

const auth = new Hono();

auth
  .post("/register", async (c) => {
    const { email, password } = await c.req.json();

    try {
      const hashedPassword = await hashPassword(password);
      await db.insert(users).values({
        email,
        password: hashedPassword,
      });
      return c.json({ message: "User registered successfully" }, 201);
    } catch (error) {
      return c.json({ message: "Registration failed" }, 400);
    }
  })
  .post("/login", async (c) => {
    const { email, password } = await c.req.json();

    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    if (!user.length) {
      return c.json({ message: "Invalid credentials" }, 401);
    }

    const isValid = await verifyPassword(password, user[0].password);
    if (!isValid) {
      return c.json({ message: "Invalid credentials" }, 401);
    }

    const sessionId = generateSessionId();
    await redisClient.set(`session:${sessionId}`, user[0].id.toString(), {
      EX: 24 * 60 * 60,
    });

    setCookie(c, "sessionId", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 24 * 60 * 60,
    });

    return c.json({ message: "Login successful" });
  })
  .post("/logout", async (c) => {
    const sessionId = getCookie(c, "sessionId");
    if (sessionId) {
      await redisClient.del(`session:${sessionId}`);
      setCookie(c, "sessionId", "", { maxAge: 0 });
    }
    return c.json({ message: "Logged out successfully" });
  });

export default auth;
