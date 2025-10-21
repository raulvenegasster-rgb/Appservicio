import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import picksRoutes from './routes/picks.routes.js';
import gamesRoutes from './routes/games.routes.js';
import rankingRoutes from './routes/ranking.routes.js';
import resultsRoutes from './routes/results.routes.js';
import { pool } from './db/pool.js';

const app = express();

dotenv.config();

const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS
  ? process.env.CORS_ALLOWED_ORIGINS.split(',').map((origin) => origin.trim()).filter(Boolean)
  : ['*'];

if (allowedOrigins.length === 0) {
  allowedOrigins.push('*');
}

const allowAllOrigins = allowedOrigins.includes('*');

app.use(
  cors({
    origin: allowAllOrigins ? '*' : allowedOrigins,
    credentials: !allowAllOrigins && process.env.CORS_ALLOW_CREDENTIALS === 'true'
  })
);
app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));

app.set('dbPool', pool);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'OfiBowlIDG API' });
});

app.use('/api/auth', authRoutes);
app.use('/api/picks', picksRoutes);
app.use('/api/games', gamesRoutes);
app.use('/api/ranking', rankingRoutes);
app.use('/api/results', resultsRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Error inesperado en el servidor' });
});

export default app;
