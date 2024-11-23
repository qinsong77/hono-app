declare module 'bun' {
  interface Env {
    DATABASE_URL: string;
    REDIS_URL: string;
    PORT: string;
    SESSION_SECRET: string;
    SESSION_EXPIRES: string;
  }
}
