import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';

import { uploadsDir } from './middleware/upload';
import postsRouter from './routes/posts';
import hashtagsRouter from './routes/hashtags';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

app.use('/api/posts', postsRouter);
app.use('/api/hashtags', hashtagsRouter);

app.get('/api/health', (req: Request, res: Response) => res.json({ status: 'ok' }));

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err) {
    return res.status(400).json({ error: err.message || 'Erro inesperado' });
  }
  next();
});

app.listen(PORT, () => {
  console.log(`Blog API rodando em http://localhost:${PORT}`);
});
