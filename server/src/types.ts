export interface PostRow {
  id: number;
  title: string;
  content: string;
  image_path: string | null;
  created_at: string;
}

export interface HashtagRow {
  id: number;
  name: string;
}

export interface CommentRow {
  id: number;
  post_id: number;
  author: string;
  content: string;
  created_at: string;
}
