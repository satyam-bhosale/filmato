import CORS_OPTIONS from '@filmato/backend/config/cors.js';
import env from '@filmato/backend/config/env.js';
import { initLogger } from '@filmato/backend/config/logger.js';
import authRouter from '@filmato/backend/routes/auth.js';
import { toTitleCase } from '@filmato/utils';
import { expressLogger } from '@logtape/express';
import cors from 'cors';
import express, { type Express } from 'express';

try {
  await initLogger();
} catch (error) {
  console.error("Failed to initialize logger:", error);
  process.exit(1);
}

const app: Express = express();

const isProduction = env.NODE_ENV === 'production';

app.use(cors(CORS_OPTIONS));

app.use(expressLogger({
  category: ["app", "http"],
  level: 'info',
  format: !isProduction ? 'combined' : 'dev',
  immediate: false
}));

app.use('/auth', authRouter);

app.use(express.json());

app.get('/', (_req, res) => {
  res.send(toTitleCase('hello express!'));
});

export default app;