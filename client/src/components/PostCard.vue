<script setup>
import HashtagText from './HashtagText.vue'

const props = defineProps({
  post: { type: Object, required: true },
})

function excerpt(text, max = 220) {
  if (text.length <= max) return text
  return text.slice(0, max).trimEnd() + '…'
}

function formatDate(iso) {
  return new Date(iso.replace(' ', 'T') + 'Z').toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}
</script>

<template>
  <article class="card post-card">
    <RouterLink v-if="post.imageUrl" :to="`/posts/${post.id}`" class="post-card__image-link">
      <img :src="post.imageUrl" :alt="post.title" class="post-card__image" />
    </RouterLink>

    <div class="post-card__body">
      <RouterLink :to="`/posts/${post.id}`" class="post-card__title">{{ post.title }}</RouterLink>
      <p class="muted post-card__meta">
        {{ formatDate(post.createdAt) }} · 💬 {{ post.commentCount }}
      </p>
      <p class="post-card__excerpt">
        <HashtagText :text="excerpt(post.content)" />
      </p>
      <div v-if="post.hashtags.length" class="post-card__tags">
        <RouterLink
          v-for="tag in post.hashtags"
          :key="tag"
          :to="{ path: '/', query: { hashtag: tag } }"
          class="hashtag"
          >#{{ tag }}</RouterLink
        >
      </div>
    </div>
  </article>
</template>

<style scoped>
.post-card {
  display: flex;
  gap: 1.25rem;
  padding: 1.25rem;
}

.post-card__image-link {
  flex-shrink: 0;
}

.post-card__image {
  width: 160px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
}

.post-card__body {
  flex: 1;
  min-width: 0;
}

.post-card__title {
  font-size: 1.25rem;
  font-weight: 700;
  text-decoration: none;
  color: var(--text);
}

.post-card__meta {
  margin: 0.25rem 0 0.5rem;
}

.post-card__excerpt {
  margin: 0 0 0.5rem;
  color: var(--text);
  line-height: 1.5;
}

.post-card__tags {
  margin-top: 0.25rem;
}

@media (max-width: 600px) {
  .post-card {
    flex-direction: column;
  }
  .post-card__image {
    width: 100%;
    height: 180px;
  }
}
</style>
