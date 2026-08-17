const express = require('express');
const db = require('../db');

const router = express.Router();

// GET /api/hashtags -> [{ name, count }]
router.get('/', (req, res) => {
  const rows = db
    .prepare(
      `SELECT h.name AS name, COUNT(ph.post_id) AS count
       FROM hashtags h
       JOIN post_hashtags ph ON ph.hashtag_id = h.id
       GROUP BY h.id
       ORDER BY count DESC, h.name ASC`
    )
    .all();
  res.json(rows);
});

module.exports = router;
