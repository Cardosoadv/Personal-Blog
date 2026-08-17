<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { fetchPost, deletePost } from '../api'
import HashtagText from '../components/HashtagText.vue'
import CommentSection from '../components/CommentSection.vue'

const props = defineProps({
  id: { type: [String, Number], required: true },
})

const router = useRouter()
const post = ref(null)
const loading = ref(true)
const notFound = ref(false)
const deleting = ref(false)

function formatDate(iso) {
  return new Date(iso.replace(' ', 'T') + 'Z').toLocaleString('pt-BR')
}

async function load() {
  loading.value = true
  notFound.value = false
  try {
    post.value = await fetchPost(props.id)
  } catch (e) {
    if (e.response?.status === 404) notFound.value = true
  } finally {
    loading.value = false
  }
}

async function remove() {
  if (!confirm('Excluir esta postagem? Essa ação não pode ser desfeita.')) return
  deleting.value = true
  try {
    await deletePost(props.id)
    router.push('/')
  } finally {
    deleting.value = false
  }
}

onMounted(load)
</script>

<template>
  <div class="post-detail">
    <div v-if="loading" class="muted">Carregando…</div>
    <div v-else-if="notFound" class="card">
      <p>Postagem não encontrada.</p>
      <RouterLink to="/">Voltar para o início</RouterLink>
    </div>
    <template v-else-if="post">
      <RouterLink to="/" class="back-link">← Todas as postagens</RouterLink>

      <article class="card">
        <img v-if="post.imageUrl" :src="post.imageUrl" :alt="post.title" class="post-detail__image" />
        <h1>{{ post.title }}</h1>
        <p class="muted">{{ formatDate(post.createdAt) }}</p>
        <div class="post-detail__content">
          <HashtagText :text="post.content" />
        </div>
        <div v-if="post.hashtags.length" class="post-detail__tags">
          <RouterLink
            v-for="tag in post.hashtags"
            :key="tag"
            :to="{ path: '/', query: { hashtag: tag } }"
            class="hashtag"
            >#{{ tag }}</RouterLink
          >
        </div>

        <button class="btn btn-danger" :disabled="deleting" @click="remove">
          {{ deleting ? 'Excluindo…' : 'Excluir postagem' }}
        </button>
      </article>

      <CommentSection :post-id="post.id" />
    </template>
  </div>
</template>

<style scoped>
.back-link {
  display: inline-block;
  margin-bottom: 1rem;
  text-decoration: none;
  color: var(--text-muted);
}

.post-detail__image {
  width: 100%;
  max-height: 420px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.post-detail__content {
  line-height: 1.7;
  font-size: 1.05rem;
  margin: 1rem 0;
}

.post-detail__tags {
  margin-bottom: 1.25rem;
}
</style>
