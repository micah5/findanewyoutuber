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
    props: [ 'type', 'tooltip', 'value', 'arr', 'update' ],
    data () {
      return {
        checked: false
      }
    },
    methods: {
      check: function() {
        if (this.arr) {
          this.checked = !this.checked
          if (this.checked == true) {
            this.$emit('add', this.arr, this.value);
          } else {
            this.$emit('remove', this.arr, this.value);
          }
        } else {
          this.update(this.value);
        }
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
.single {
  background: url('../assets/icons/single.png');
  background-size: 100%;
}
.couple {
  background: url('../assets/icons/couple.png');
  background-size: 100%;
}
.baby {
  background: url('../assets/icons/baby.png');
  background-size: 100%;
}
.no_baby {
  background: url('../assets/icons/no_baby.png');
  background-size: 100%;
}
.animation {
  background: url('../assets/icons/animation.png');
  background-size: 100%;
}
.documentary {
  background: url('../assets/icons/documentary.png');
  background-size: 100%;
}
.drama {
  background: url('../assets/icons/drama.png');
  background-size: 100%;
}
.fashion {
  background: url('../assets/icons/fashion.png');
  background-size: 100%;
}
.gaming {
  background: url('../assets/icons/gaming.png');
  background-size: 100%;
}
.music {
  background: url('../assets/icons/music.png');
  background-size: 100%;
}
.news {
  background: url('../assets/icons/news.png');
  background-size: 100%;
}
.pets {
  background: url('../assets/icons/pets.png');
  background-size: 100%;
}
.podcast {
  background: url('../assets/icons/podcast.png');
  background-size: 100%;
}
.sports {
  background: url('../assets/icons/sports.png');
  background-size: 100%;
}
.travel {
  background: url('../assets/icons/travel.png');
  background-size: 100%;
}
.vlog {
  background: url('../assets/icons/vlog.png');
  background-size: 100%;
}
.critical {
  background: url('../assets/icons/critical.png');
  background-size: 100%;
}
.fun {
  background: url('../assets/icons/fun.png');
  background-size: 100%;
}
.nonchelant {
  background: url('../assets/icons/nonchelant.png');
  background-size: 100%;
}
.angry {
  background: url('../assets/icons/angry.png');
  background-size: 100%;
}
.crazy {
  background: url('../assets/icons/crazy.png');
  background-size: 100%;
}
</style>
