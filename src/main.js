import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router/index.js'

import 'jquery/dist/jquery.min'
import 'popper.js/dist/popper.min'

createApp(App).use(router).mount('#app')