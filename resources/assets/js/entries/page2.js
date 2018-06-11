import Vue from 'vue'

import Page2 from '@/page2.vue'

new Vue({
  el: '#page2',
  // Attach the Vue instance to the window,
  // so it's available globally.
  render: h => h(Page2)
})