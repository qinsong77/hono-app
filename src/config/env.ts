export const env = {
  DATABASE_URL: process.env.DATABASE_URL!,
  REDIS_URL: process.env.REDIS_URL!,
  PORT: Number.parseInt(process.env.PORT || '3000'),
  NODE_ENV: process.env.NODE_ENV || 'development',
  SESSION_SECRET: process.env.SESSION_SECRET!,
  SESSION_EXPIRES: Number.parseInt(process.env.SESSION_EXPIRES || '86400'),
} as const;

const requiredEnvVars = [
  'DATABASE_URL',
  'REDIS_URL',
  'SESSION_SECRET',
] as const;

for (const envVar of requiredEnvVars) {
  if (!env[envVar as keyof typeof env]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}
