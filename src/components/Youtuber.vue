<template>
  <div style="position: relative;" class="pt-5">
    <h3 class="black--text">80% match</h3>
    <v-card
      class="mx-auto hide-overflow"
      style="max-width: 1000px;"
    >
      <iframe width="100%" height="315"
        src="https://www.youtube.com/embed/Z6ytvzNlmRo?showinfo=0&modestbranding=1" frameborder="0">
      </iframe>
      <v-card-title>
        <div style="text-align: left;">
          <span class="headline">the riley channel</span>
          <div class="black--text font-weight-light">
            <v-icon color="black" left small>accessibility_new</v-icon> est age: <span class="grey--text">23</span>,
            <v-icon color="black" left small>face</v-icon> est gender: <span class="blue--text">male</span>
          </div>
          <div class="black--text font-weight-light">
            <v-icon color="black" left small>fas fa-heart</v-icon> est relationship: <span class="grey--text">couple</span>
          </div>
        </div>
        <v-spacer></v-spacer>
        <v-btn dark color="orange" small class="mt-0 mr-3" style="border-width: 0px; height: 25px;">
          <i class="fab fa-reddit-alien"></i> &nbsp; u/oppai_suika
        </v-btn>
        <div class="g-ytsubscribe" data-channel="GoogleDevelopers" data-layout="default" data-count="default"></div>
      </v-card-title>
      <div class="grey--text font-weight-light pa-3" style="text-align: left; white-space: pre-line" v-html="description"></div>
      <v-divider></v-divider>
      <v-card-actions>
        <span class="pl-2 grey--text text--darken-2 font-weight-light caption">16,544 reviews</span>
        <v-spacer></v-spacer>
      </v-card-actions>
      <div class="pa-3 pt-0 caption">
        <em>Portions of the materials used are trademarks and/or copyrighted works of Epic Games, Inc. All rights reserved by Epic. This material is not official and is not endorsed by Epic.</em>
      </div>
    </v-card>
    <v-img class="ml-3 mt-5 hover-img" src="/static/img/AN66SAx8YPLKjPlKWYXLA2VioQdFQmeRuVJLGqWYrQ=s800-mo-c-c0xffffffff-rj-k-no.36fc0b4.png">
    </v-img>
  </div>
</template>

<script>
export default {
    name: 'youtuber',
    props: ['type', 'tooltip'],
    data () {
      return {
        copied: false,
        dialog: false,
        rating: 10,
        description: 'Boneless Pizza? Naw Boneless Boys!!  My Name is Riley Holmquist and I am a boneless boy.  We vlog Every other week, Leave a comment and subscribe and your comment might be read on the next video follow our senior year!\n\nFollow my twitter-\n@RileyHolmquist\n\nInstagram-\n@riley_holmz\n\nGaming Channel-\nThe Gaming Sneetch'
      }
    },
    methods: {
      copy () {
        const markup = this.$refs.link
        markup.focus()
        document.execCommand('selectAll', false, null)
        this.copied = document.execCommand('copy')
      }
    }
}
</script>

<style scoped>
.v-card {
  border-style: solid;
  border-color: black;
  border-width: 4px;
  box-shadow: 10px 10px !important;
  text-transform: lowercase !important;
}
.hover-img {
  position: absolute;
  top: 0;
  width: 100px;
  border-radius: 50px;
  left: 0px;
  border-style: solid;
  border-color: black;
  border-width: 4px;
  box-shadow: -10px -10px black;
}
</style>
