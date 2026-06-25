import { createApp } from 'vue'
import App from './App.vue'          // 注意：这里的 App.vue 是一个简单的根组件（只包含 <router-view/>）
import router from './router'

const app = createApp(App)
app.use(router)
app.mount('#app')