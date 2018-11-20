<template>
    <div id="app">
      <v-app>
          <core2></core2>
      </v-app>
    </div>
</template>

<script>
import Core2 from 'components/Core2'
import Vue from 'vue'
import Vuetify from 'vuetify'
import VueScrollTo from'vue-scrollto'

Vue.use(Vuetify)

Vue.use(VueScrollTo)

// You can also pass in the default options
Vue.use(VueScrollTo, {
     container: "body",
     duration: 500,
     easing: "ease",
     offset: 0,
     force: true,
     cancelable: true,
     onStart: false,
     onDone: false,
     onCancel: false,
     x: false,
     y: true
 })

export default {
  name: 'app',
  components: {
      Core2
  }
}
</script>

<style scoped>
.application {
  background: transparent !important;
}
</style>
