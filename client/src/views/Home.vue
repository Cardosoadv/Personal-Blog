<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchPosts, fetchHashtags, type Post, type HashtagCount } from '../api'
import PostCard from '../components/PostCard.vue'

const route = useRoute()
const router = useRouter()

const posts = ref<Post[]>([])
const hashtags = ref<HashtagCount[]>([])
const loading = ref(true)
const errorMsg = ref('')
const searchTerm = ref((route.query.search as string) || '')

const activeHashtag = () => (route.query.hashtag as string) || ''

async function load() {
  loading.value = true
  errorMsg.value = ''
  try {
    const [postsData, hashtagsData] = await Promise.all([
      fetchPosts({ hashtag: route.query.hashtag as string, search: route.query.search as string }),
      fetchHashtags(),
    ])
    posts.value = postsData
    hashtags.value = hashtagsData
  } catch (e) {
    errorMsg.value = 'Não foi possível carregar as postagens.'
  } finally {
    loading.value = false
  }
}

function clearFilters() {
  searchTerm.value = ''
  router.push({ path: '/' })
}

function submitSearch() {
  router.push({ path: '/', query: { search: searchTerm.value || undefined } })
}

watch(() => [route.query.hashtag, route.query.search], load)
onMounted(load)
</script>

<template>
  <div class="home">
    <div class="home__toolbar">
      <form class="search-form" @submit.prevent="submitSearch">
        <input
          v-model="searchTerm"
          type="text"
          placeholder="Buscar postagens…"
          aria-label="Buscar postagens"
        />
        <button class="btn btn-primary" type="submit">Buscar</button>
      </form>

      <div v-if="hashtags.length" class="hashtag-cloud">
        <RouterLink
          v-for="tag in hashtags"
          :key="tag.name"
          :to="{ path: '/', query: { hashtag: tag.name } }"
          class="hashtag"
          :class="{ active: activeHashtag() === tag.name }"
        >
          #{{ tag.name }} ({{ tag.count }})
        </RouterLink>
      </div>
    </div>

    <div v-if="activeHashtag() || route.query.search" class="active-filter">
      <span v-if="activeHashtag()">Filtrando por <strong>#{{ activeHashtag() }}</strong></span>
      <span v-else-if="route.query.search">Buscando por "<strong>{{ route.query.search }}</strong>"</span>
      <button class="btn btn-ghost" @click="clearFilters">Limpar filtro</button>
    </div>

    <div v-if="loading" class="muted">Carregando…</div>
    <p v-else-if="errorMsg" class="error-text">{{ errorMsg }}</p>
    <p v-else-if="!posts.length" class="muted">
      Nenhuma postagem encontrada.
      <RouterLink to="/new">Crie a primeira!</RouterLink>
    </p>
    <div v-else class="post-list">
      <PostCard v-for="post in posts" :key="post.id" :post="post" />
    </div>
  </div>
</template>

<style scoped>
.home__toolbar {
  margin-bottom: 1.5rem;
}

.search-form {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.search-form input {
  flex: 1;
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 0.6rem 0.75rem;
  font-size: 1rem;
}

.hashtag-cloud {
  display: flex;
  flex-wrap: wrap;
}

.active-filter {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}

.post-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
