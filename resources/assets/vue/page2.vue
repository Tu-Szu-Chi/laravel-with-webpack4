<template>
  <div id="page2">
    <div class="container app-content">
      <hello/>
    </div>
  </div>

</template>

<script>
import Hello from '@/component/hello.vue'

export default {
  name: 'page2',
  components: { Hello },
  data () {
    return {
    }
  }
}
</script>

<style>
html {
  position: relative;
  min-height: 100%;
}
body {
  /* Margin bottom by footer height */
  margin-bottom: 60px;
}
.app-content {
  padding: 60px 15px 0;
}
</style>