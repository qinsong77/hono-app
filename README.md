# Hono + Drizzle + Redis + PostgresSQL

> Mainly generate by cursor, with some manual adjustments.

To install dependencies:

```sh
bun install
```

To run:

```sh
# add .env file first
docker compose up
bunx drizzle-kit push
bun run dev
```

open http://localhost:3000

or using Webstorm or Intellij IDEA, taking `ws-http-requests/auth.http` as example to test api.

## todo

- Docker compose `postgresql-init` failed, `Unrecognised migration name format: 0000_wakeful_proteus.sql`, Dizzle generated sql not matched,
maybe should use `drizzle-kit push` on ci for production.

## Note

### Swagger

Hono with swagger is not so convenient, check this issue [honojs/hono#2970](https://github.com/honojs/hono/issues/2970)

### Redis

- Redis URL Format：`redis://[username]:[password]@host:port`

> Note: For Redis versions < 6.0, only password authentication is supported (no username). 
> The connection URL can be simplified to: `redis://:password@host:port`

### Env

1. bun support env directly, no need dotenv, but `bunx` cant read `.env.local` when run `bunx drizzle-kit push`

## Script

### local

- `bunx drizzle-kit push` apply changes to your database, or

generate migrations: `bunx drizzle-kit generate`, then apply `drizzle-kit migrate`

## chore
https://dprint.dev/config/
https://eslint.style/guide/why

## Docker

### 运行 Docker 服务

基本命令：
```bash
# 启动所有服务
docker compose up

# 后台运行
docker compose up -d

# 构建并启动（修改配置后使用）
docker compose up --build
```

### 查看日志

```bash
# 查看所有服务的日志
docker compose logs

# 查看特定服务的日志（如 postgresql-init）
docker compose logs postgresql-init

# 实时查看日志
docker compose logs -f
```

### 管理容器

```bash
# 停止服务
docker compose down

# 停止并删除卷（谨慎使用，会删除数据）
docker compose down -v

# 查看服务状态
docker compose ps

# 重启特定服务
docker compose restart postgresql-init
```

### Flyway 迁移说明

1. 迁移文件位置：`migrations/postgresql/`
2. 文件命名规范：`V{version}__{description}.sql`
   - 例如：`V1__init.sql`, `V2__add_users.sql`
3. 版本号必须递增
4. 迁移自动执行：服务启动时会自动执行未应用的迁移脚本
