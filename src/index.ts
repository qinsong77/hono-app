import { Hono } from "hono";
import { cors } from "hono/cors";
import auth from "./routes/auth";
import user from "./routes/user";

const app = new Hono();

// 启用 CORS
app.use("/*", cors());

// 路由挂载
app.route("/api/auth", auth);
app.route("/api/users", user);

export default app;
