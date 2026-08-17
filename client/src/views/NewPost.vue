<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { createPost } from '../api'

const router = useRouter()

const title = ref('')
const content = ref('')
const imageFile = ref(null)
const imagePreview = ref('')
const submitting = ref(false)
const error = ref('')

const detectedHashtags = computed(() => {
  const text = `${title.value} ${content.value}`
  const found = new Set()
  for (const match of text.matchAll(/#([\p{L}0-9_]+)/gu)) {
    found.add(match[1].toLowerCase())
  }
  return [...found]
})

function onFileChange(e) {
  const file = e.target.files[0]
  imageFile.value = file || null
  if (imagePreview.value) URL.revokeObjectURL(imagePreview.value)
  imagePreview.value = file ? URL.createObjectURL(file) : ''
}

async function submit() {
  error.value = ''
  if (!title.value.trim() || !content.value.trim()) {
    error.value = 'Título e conteúdo são obrigatórios.'
    return
  }
  submitting.value = true
  try {
    const post = await createPost({
      title: title.value,
      content: content.value,
      image: imageFile.value,
    })
    router.push(`/posts/${post.id}`)
  } catch (e) {
    error.value = e.response?.data?.error || 'Não foi possível publicar a postagem.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="new-post">
    <h1>Nova postagem</h1>

    <form class="card" @submit.prevent="submit">
      <div class="form-field">
        <label for="title">Título</label>
        <input id="title" v-model="title" type="text" maxlength="200" placeholder="Título da postagem" />
      </div>

      <div class="form-field">
        <label for="content">Conteúdo</label>
        <textarea
          id="content"
          v-model="content"
          rows="10"
          placeholder="Escreva sua postagem… use #hashtags para categorizar"
        ></textarea>
        <p class="muted">
          Dica: qualquer palavra com # vira uma hashtag pesquisável, ex: #viagem #receitas
        </p>
      </div>

      <div v-if="detectedHashtags.length" class="detected-tags">
        <span class="hashtag" v-for="tag in detectedHashtags" :key="tag">#{{ tag }}</span>
      </div>

      <div class="form-field">
        <label for="image">Imagem (opcional)</label>
        <input id="image" type="file" accept="image/png,image/jpeg,image/gif,image/webp" @change="onFileChange" />
        <img v-if="imagePreview" :src="imagePreview" alt="Pré-visualização" class="image-preview" />
      </div>

      <p v-if="error" class="error-text">{{ error }}</p>

      <button class="btn btn-primary" type="submit" :disabled="submitting">
        {{ submitting ? 'Publicando…' : 'Publicar' }}
      </button>
    </form>
  </div>
</template>

<style scoped>
.new-post h1 {
  margin-bottom: 1rem;
}

.detected-tags {
  margin: -0.5rem 0 1rem;
}

.image-preview {
  margin-top: 0.75rem;
  max-width: 100%;
  max-height: 260px;
  border-radius: 8px;
  object-fit: cover;
}
</style>
