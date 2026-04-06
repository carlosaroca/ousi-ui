import { createApp } from 'vue'
import { OusiUIPlugin } from '@ousi-ui/vue'
import App from './App.vue'
import './app.css'

const app = createApp(App)
app.use(OusiUIPlugin)
app.mount('#app')
