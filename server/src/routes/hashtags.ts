import { Router, Request, Response } from 'express';
import db from '../db';

const router = Router();

interface HashtagCount {
  name: string;
  count: number;
}

// GET /api/hashtags -> [{ name, count }]
router.get('/', (req: Request, res: Response) => {
  const rows = db
    .prepare(
      `SELECT h.name AS name, COUNT(ph.post_id) AS count
       FROM hashtags h
       JOIN post_hashtags ph ON ph.hashtag_id = h.id
       GROUP BY h.id
       ORDER BY count DESC, h.name ASC`
    )
    .all() as HashtagCount[];
  res.json(rows);
});

export default router;
