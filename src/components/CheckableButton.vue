<template>
  <v-tooltip bottom color="white" class="ml-3 mr-3">
      <v-btn slot="activator" :class="type" color="white" fab light @click="check()">
        <v-fade-transition>
          <v-icon v-show="checked" style="background-color: rgba(255, 255, 255, 0.8); width: 100%; height: 56px; border-radius: 35px;">done</v-icon>
        </v-fade-transition>
      </v-btn>
    <span>{{tooltip}}</span>
  </v-tooltip>
</template>

<script>
export default {
    name: 'checkable-button',
    props: ['type', 'tooltip'],
    data () {
      return {
        checked: false
      }
    },
    methods: {
      check: function() {
        this.checked = !this.checked
      }
    }
}
</script>

<style scoped>
.v-tooltip__content {
  border-radius: 20px;
  color: #000000;
  padding-left: 15px;
  padding-right: 15px;
}
.man {
  background: url('../assets/icons/man.png');
  background-size: 105%;
}
.woman {
  background: url('../assets/icons/lady.png');
  background-size: 105%;
}
.unknown {
  background: url('../assets/icons/unknown.png');
  background-size: 100%;
}
</style>
