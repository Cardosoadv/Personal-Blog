const express = require('express');
const fs = require('fs');
const path = require('path');
const db = require('../db');
const { upload, uploadsDir } = require('../middleware/upload');
const { extractHashtags } = require('../utils/hashtags');

const router = express.Router();

function getHashtagsForPost(postId) {
  return db
    .prepare(
      `SELECT h.name FROM hashtags h
       JOIN post_hashtags ph ON ph.hashtag_id = h.id
       WHERE ph.post_id = ?
       ORDER BY h.name`
    )
    .all(postId)
    .map((r) => r.name);
}

function getCommentCount(postId) {
  return db.prepare('SELECT COUNT(*) AS c FROM comments WHERE post_id = ?').get(postId).c;
}

function serializePost(row) {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    imageUrl: row.image_path ? `/uploads/${row.image_path}` : null,
    createdAt: row.created_at,
    hashtags: getHashtagsForPost(row.id),
    commentCount: getCommentCount(row.id),
  };
}

function syncHashtags(postId, text) {
  const names = extractHashtags(text);
  db.prepare('DELETE FROM post_hashtags WHERE post_id = ?').run(postId);
  const insertHashtag = db.prepare('INSERT OR IGNORE INTO hashtags (name) VALUES (?)');
  const getHashtagId = db.prepare('SELECT id FROM hashtags WHERE name = ?');
  const link = db.prepare('INSERT OR IGNORE INTO post_hashtags (post_id, hashtag_id) VALUES (?, ?)');
  for (const name of names) {
    insertHashtag.run(name);
    const { id } = getHashtagId.get(name);
    link.run(postId, id);
  }
}

// GET /api/posts?hashtag=foo&search=bar
router.get('/', (req, res) => {
  const { hashtag, search } = req.query;
  let rows;

  if (hashtag) {
    rows = db
      .prepare(
        `SELECT p.* FROM posts p
         JOIN post_hashtags ph ON ph.post_id = p.id
         JOIN hashtags h ON h.id = ph.hashtag_id
         WHERE h.name = ?
         ORDER BY p.created_at DESC`
      )
      .all(String(hashtag).toLowerCase().replace(/^#/, ''));
  } else if (search) {
    rows = db
      .prepare(
        `SELECT * FROM posts WHERE title LIKE ? OR content LIKE ? ORDER BY created_at DESC`
      )
      .all(`%${search}%`, `%${search}%`);
  } else {
    rows = db.prepare('SELECT * FROM posts ORDER BY created_at DESC').all();
  }

  res.json(rows.map(serializePost));
});

// GET /api/posts/:id
router.get('/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM posts WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Post não encontrado' });
  res.json(serializePost(row));
});

// POST /api/posts  (multipart/form-data: title, content, image?)
router.post('/', upload.single('image'), (req, res) => {
  const { title, content } = req.body;
  if (!title || !title.trim() || !content || !content.trim()) {
    if (req.file) fs.unlinkSync(path.join(uploadsDir, req.file.filename));
    return res.status(400).json({ error: 'Título e conteúdo são obrigatórios' });
  }

  const imagePath = req.file ? req.file.filename : null;
  const info = db
    .prepare('INSERT INTO posts (title, content, image_path) VALUES (?, ?, ?)')
    .run(title.trim(), content.trim(), imagePath);

  syncHashtags(info.lastInsertRowid, `${title} ${content}`);

  const row = db.prepare('SELECT * FROM posts WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(serializePost(row));
});

// DELETE /api/posts/:id
router.delete('/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM posts WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Post não encontrado' });

  db.prepare('DELETE FROM posts WHERE id = ?').run(req.params.id);
  if (row.image_path) {
    const filePath = path.join(uploadsDir, row.image_path);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }
  res.status(204).end();
});

// GET /api/posts/:id/comments
router.get('/:id/comments', (req, res) => {
  const post = db.prepare('SELECT id FROM posts WHERE id = ?').get(req.params.id);
  if (!post) return res.status(404).json({ error: 'Post não encontrado' });

  const comments = db
    .prepare('SELECT * FROM comments WHERE post_id = ? ORDER BY created_at ASC')
    .all(req.params.id);
  res.json(
    comments.map((c) => ({
      id: c.id,
      postId: c.post_id,
      author: c.author,
      content: c.content,
      createdAt: c.created_at,
    }))
  );
});

// POST /api/posts/:id/comments  { author, content }
router.post('/:id/comments', (req, res) => {
  const post = db.prepare('SELECT id FROM posts WHERE id = ?').get(req.params.id);
  if (!post) return res.status(404).json({ error: 'Post não encontrado' });

  const { author, content } = req.body;
  if (!content || !content.trim()) {
    return res.status(400).json({ error: 'Comentário não pode ser vazio' });
  }

  const info = db
    .prepare('INSERT INTO comments (post_id, author, content) VALUES (?, ?, ?)')
    .run(req.params.id, (author && author.trim()) || 'Anônimo', content.trim());

  const row = db.prepare('SELECT * FROM comments WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json({
    id: row.id,
    postId: row.post_id,
    author: row.author,
    content: row.content,
    createdAt: row.created_at,
  });
});

module.exports = router;
