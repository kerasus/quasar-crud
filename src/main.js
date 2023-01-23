import { createApp } from 'vue'
import App from './App.vue'
import { Quasar } from 'quasar'
import quasarUserOptions from './quasar-user-options.js'
import { createRouter, createWebHistory } from 'vue-router'

import List from './TestPages/List.vue'
import Show from './TestPages/Show.vue'
import Create from './TestPages/Create.vue'
import Edit from './TestPages/Edit.vue'

const routes = [
  { name: 'User.Index', path: '/', component: List },
  { name: 'User.Create', path: '/create', component: Create },
  { name: 'User.Show', path: '/show/:id', component: Show },
  { name: 'User.Edit', path: '/:id/edit', component: Edit },
  { name: 'User.Create', path: '/create', component: Create }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

createApp(App)
  .use(router)
  .use(Quasar, quasarUserOptions)
  .mount('#app')
