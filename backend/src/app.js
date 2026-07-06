import express from 'express';
import cors from 'cors';
import router from './router/index.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', router);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

export default app;
