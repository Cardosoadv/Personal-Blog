<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="app-shell">
    <header class="site-header">
      <RouterLink to="/" class="brand">📝 Meu Blog</RouterLink>
      <nav>
        <RouterLink to="/" class="nav-link">Início</RouterLink>
        <RouterLink to="/new" class="nav-link nav-link--cta">Nova postagem</RouterLink>
      </nav>
    </header>

    <main class="site-main">
      <RouterView />
    </main>

    <footer class="site-footer">
      <span>Feito com Express + Vue</span>
    </footer>
  </div>
</template>

<style>
.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.site-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border);
  background: var(--surface);
  position: sticky;
  top: 0;
  z-index: 10;
}

.brand {
  font-weight: 700;
  font-size: 1.25rem;
  color: var(--text);
  text-decoration: none;
}

.site-header nav {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.nav-link {
  color: var(--text-muted);
  text-decoration: none;
  font-weight: 500;
}

.nav-link.router-link-active {
  color: var(--accent);
}

.nav-link--cta {
  background: var(--accent);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
}

.nav-link--cta.router-link-active {
  color: white;
}

.site-main {
  flex: 1;
  width: 100%;
  max-width: 960px;
  margin: 0 auto;
  padding: 1.5rem;
}

.site-footer {
  text-align: center;
  padding: 1.5rem;
  color: var(--text-muted);
  font-size: 0.875rem;
}
</style>
