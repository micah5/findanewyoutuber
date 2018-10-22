import Vue from 'vue'
import Vuetify from 'vuetify'

// Helpers
import colors from 'vuetify/es5/util/colors'

console.log('here')

Vue.use(Vuetify, {
  theme: {
    primary: '#FF35E9', // #E53935
    secondary: '#2DC4E4', // #FFCDD2
    accent: '#FFEF4B' // #3F51B5
  }
})
