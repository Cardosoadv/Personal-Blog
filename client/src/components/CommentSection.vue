<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { fetchComments, createComment, type Comment } from '../api'

const props = defineProps<{
  postId: string | number
}>()

const comments = ref<Comment[]>([])
const loading = ref(true)
const author = ref('')
const content = ref('')
const submitting = ref(false)
const error = ref('')

async function load() {
  loading.value = true
  try {
    comments.value = await fetchComments(props.postId)
  } finally {
    loading.value = false
  }
}

async function submit() {
  error.value = ''
  if (!content.value.trim()) {
    error.value = 'Escreva um comentário antes de enviar.'
    return
  }
  submitting.value = true
  try {
    const comment = await createComment(props.postId, {
      author: author.value,
      content: content.value,
    })
    comments.value.push(comment)
    content.value = ''
  } catch (e: any) {
    error.value = e.response?.data?.error || 'Não foi possível enviar o comentário.'
  } finally {
    submitting.value = false
  }
}

function formatDate(iso: string) {
  return new Date(iso.replace(' ', 'T') + 'Z').toLocaleString('pt-BR')
}

onMounted(load)
</script>

<template>
  <section class="comments">
    <h2>Comentários ({{ comments.length }})</h2>

    <div v-if="loading" class="muted">Carregando comentários…</div>
    <ul v-else-if="comments.length" class="comment-list">
      <li v-for="c in comments" :key="c.id" class="comment card">
        <div class="comment__header">
          <strong>{{ c.author }}</strong>
          <span class="muted">{{ formatDate(c.createdAt) }}</span>
        </div>
        <p class="comment__content">{{ c.content }}</p>
      </li>
    </ul>
    <p v-else class="muted">Ainda não há comentários. Seja o primeiro a comentar!</p>

    <form class="comment-form" @submit.prevent="submit">
      <div class="form-field">
        <label for="author">Nome (opcional)</label>
        <input id="author" v-model="author" type="text" placeholder="Anônimo" maxlength="80" />
      </div>
      <div class="form-field">
        <label for="content">Comentário</label>
        <textarea
          id="content"
          v-model="content"
          rows="3"
          placeholder="Escreva seu comentário…"
        ></textarea>
      </div>
      <p v-if="error" class="error-text">{{ error }}</p>
      <button class="btn btn-primary" type="submit" :disabled="submitting">
        {{ submitting ? 'Enviando…' : 'Comentar' }}
      </button>
    </form>
  </section>
</template>

<style scoped>
.comments {
  margin-top: 2.5rem;
}

.comment-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin: 1rem 0;
}

.comment {
  padding: 0.9rem 1rem;
}

.comment__header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.35rem;
}

.comment__content {
  margin: 0;
  line-height: 1.5;
}

.comment-form {
  margin-top: 1.5rem;
  max-width: 480px;
}
</style>
