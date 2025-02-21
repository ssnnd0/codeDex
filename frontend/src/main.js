import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Presentation from './components/Presentation.vue'

const routes = [
  { path: '/', component: App },
  { path: '/:roomId', component: Presentation },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

createApp(App).use(router).mount('#app')
