import { Hono } from 'hono';
import { logger } from 'hono/logger';
import auth from './routes/auth';
import user from './routes/user';

const app = new Hono();
app.use(logger());

app.get('/', (c) => c.text('Hello World!'));
app.route('/api/auth', auth);
app.route('/api/user', user);

export default app;
