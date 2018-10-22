<template>
    <div id="app">
      <v-app>
        <core></core>
      </v-app>
    </div>
</template>

<script>
import Core from 'components/Core'
import Vue from 'vue'
import Vuetify from 'vuetify'

Vue.use(Vuetify)

export default {
  name: 'app',
  components: {
      Core
  }
}
</script>

<style scoped>
.application {
  background: transparent !important;
}
</style>
