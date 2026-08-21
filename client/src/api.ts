import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

export interface Post {
  id: number
  title: string
  content: string
  imageUrl: string | null
  createdAt: string
  hashtags: string[]
  commentCount: number
}

export interface Comment {
  id: number
  postId: number
  author: string
  content: string
  createdAt: string
}

export interface HashtagCount {
  name: string
  count: number
}

export function fetchPosts({ hashtag, search }: { hashtag?: string; search?: string } = {}) {
  return api.get<Post[]>('/posts', { params: { hashtag, search } }).then((r) => r.data)
}

export function fetchPost(id: string | number) {
  return api.get<Post>(`/posts/${id}`).then((r) => r.data)
}

export function createPost({
  title,
  content,
  image,
}: {
  title: string
  content: string
  image?: File | null
}) {
  const form = new FormData()
  form.append('title', title)
  form.append('content', content)
  if (image) form.append('image', image)
  return api.post<Post>('/posts', form).then((r) => r.data)
}

export function deletePost(id: string | number) {
  return api.delete(`/posts/${id}`)
}

export function fetchComments(postId: string | number) {
  return api.get<Comment[]>(`/posts/${postId}/comments`).then((r) => r.data)
}

export function createComment(postId: string | number, { author, content }: { author?: string; content: string }) {
  return api.post<Comment>(`/posts/${postId}/comments`, { author, content }).then((r) => r.data)
}

export function fetchHashtags() {
  return api.get<HashtagCount[]>('/hashtags').then((r) => r.data)
}

export default api
