const express = require('express');
const cors = require('cors');
const path = require('path');

const { uploadsDir } = require('./middleware/upload');
const postsRouter = require('./routes/posts');
const hashtagsRouter = require('./routes/hashtags');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

app.use('/api/posts', postsRouter);
app.use('/api/hashtags', hashtagsRouter);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use((err, req, res, next) => {
  if (err) {
    return res.status(400).json({ error: err.message || 'Erro inesperado' });
  }
  next();
});

app.listen(PORT, () => {
  console.log(`Blog API rodando em http://localhost:${PORT}`);
});
