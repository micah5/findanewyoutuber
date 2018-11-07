<template>
  <div class="mb-3">
    <h3 class="mb-0">most common topics</h3>
    <p class="grey--text mb-2">Calculated from video titles</p>
    <v-btn
      :color="(index % 3) == 0 ? '#FAD34E' : (index % 2) ? '#F6BA4A' : '#F09D44'"
      v-for="(obj, index) in ((words.length > max_words && show_all == false) ? words.slice(0, max_words) : words)"
      >
      {{obj.name}} <small>&nbsp;	&#215;{{obj.frequency}}</small>
    </v-btn>
    <v-btn color="#68D35B" v-if="words.length > max_words" @click="show_all = !show_all">{{show_all ? 'minimise' : 'show all'}}</v-btn>
  </div>
</template>

<script>
export default {
    name: 'most-common-words',
    props: ['words'],
    data () {
      return {
        show_all: false,
        max_words: 18
      }
    },
}
</script>
