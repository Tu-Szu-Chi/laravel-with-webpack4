<template>
  <div id="page1">
    <div class="container app-content">
      <h1>Haa???aa ??</h1>
      <bye-bye/>
    </div>
  </div>

</template>

<script>
import ByeBye from '@/component/byebye.vue'

require('%/app.scss')

export default {
  name: 'page2',
  components: { ByeBye },
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
  margin-bottom: 60px;
}
.app-content {
  padding: 60px 15px 0;
}
</style>