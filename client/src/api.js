import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

export function fetchPosts({ hashtag, search } = {}) {
  return api.get('/posts', { params: { hashtag, search } }).then((r) => r.data)
}

export function fetchPost(id) {
  return api.get(`/posts/${id}`).then((r) => r.data)
}

export function createPost({ title, content, image }) {
  const form = new FormData()
  form.append('title', title)
  form.append('content', content)
  if (image) form.append('image', image)
  return api.post('/posts', form).then((r) => r.data)
}

export function deletePost(id) {
  return api.delete(`/posts/${id}`)
}

export function fetchComments(postId) {
  return api.get(`/posts/${postId}/comments`).then((r) => r.data)
}

export function createComment(postId, { author, content }) {
  return api.post(`/posts/${postId}/comments`, { author, content }).then((r) => r.data)
}

export function fetchHashtags() {
  return api.get('/hashtags').then((r) => r.data)
}

export default api
