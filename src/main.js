import './style.css'
import { router } from './router.js'
import { createApp } from 'vue'
import Layout from './layout/Layout.vue'

const app = createApp(Layout)
app.use(router)
app.mount('#app')
