import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import PostDetail from '../views/PostDetail.vue'
import NewPost from '../views/NewPost.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: Home },
    { path: '/new', name: 'new-post', component: NewPost },
    { path: '/posts/:id', name: 'post-detail', component: PostDetail, props: true },
  ],
})

export default router
