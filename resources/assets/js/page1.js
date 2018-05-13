import Vue from 'vue'

import Page1 from '../vue/page1.vue'

new Vue({
  el: '#page1',
  // Attach the Vue instance to the window,
  // so it's available globally.
  render: h => h(Page1)
})