<template>
    <div id="main">
        <img class="bg-img rellax" data-rellax-speed="-6" src="../assets/bg/layer5.png"></img>
        <img class="bg-img rellax" data-rellax-speed="-4" src="../assets/bg/layer4.png"></img>
        <img class="bg-img rellax" data-rellax-speed="-2" src="../assets/bg/layer3.png" style="opacity: 0.6;"></img>
        <!--<img class="bg-img rellax" style="margin-top:200vh" data-rellax-speed="-4" src="../assets/bg/layer2.png"></img>
        <img class="bg-img rellax" style="margin-top:300vh" data-rellax-speed="-1" src="../assets/bg/layer1.png"></img>-->
        <div style="width: 100%; height: 600vh; position: absolute; background-image: linear-gradient(transparent, #FBC02D, yellow, #FBC02D, transparent);" class="rellax" data-rellax-speed="2"></div>
        <!--<div style="width: 100%; height: 300vh; position: absolute; margin-top: 750vh; background-image: linear-gradient(transparent, red, red, transparent);" class="rellax" data-rellax-speed="2"></div>-->
        <header>
        <div class="black--text" style="position: absolute; margin-top: 89vh; width: 100%;">
          <h4>
            <span class="boxy">if you'd like suggestions for things to search, scroll below ⤵</span>
          </h4>
        </div>
            <v-container><!-- Place this tag where you want the button to render. -->
              <v-layout row style="position: absolute; right: 0; top: 0;" class="pa-3">
                <a class="github-button" href="https://github.com/98mprice/findanewvlogger" data-icon="octicon-star" data-size="large" aria-label="Star 98mprice/findanewvlogger on GitHub">Star</a>
                <!--<v-btn small href="https://gitlab.com/98mprice/findanewvlogger" class="ml-2 mt-0 mb-0 mr-0 pa-0" style='text-transform: capitalize; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;'><v-icon small left>fab fa-gitlab</v-icon> Star</v-btn>-->
              </v-layout>
                <h1><span class="boxy">find a new youtuber</span></h1>
                <h3><span class="boxy" style="font-size: 0.8em;">personality based youtuber search <small>~ powered by reddit, ai & ❤</small></span></h3>
                <h3 class="mb-0 white--text" style="margin-top: 20vh;">what does your perfect youtuber look like?</h3>
                <h3 class="mt-0 white--text"><small>you can search a combination for things, people, age ranges, genders, personality types etc.</small></h3>
                <v-layout column>
                  <v-text-field class="test_input"
                    v-model="input_tag"
                    @keyup.enter.native="addTag"
                    label="e.g. gaming, fashion, college, japan, casey neistat, female, 20 years old, fun, outgoing etc"
                    solo
                  ></v-text-field>
                  <v-layout row wrap align-center>
                    <v-slide-y-transition>
                      <v-flex class="text-xs-center">
                        <v-btn
                          color="white"
                          v-for="tag in tags"
                          @click="removeTag(tag)"
                          >
                          {{tag}}<small><v-icon>close</v-icon></small>
                        </v-btn>
                      </v-flex>
                    </v-slide-y-transition>
                  </v-layout>
                </v-layout>
                <v-layout row wrap style="margin-top: 50vh">
                  <v-flex
                    xs12 sm3 offset-sm2
                  >
                    <h3>
                      <span class="boxy">age range ↪</span>
                    </h3>
                  </v-flex>
                  <v-flex xs12 sm4 :class="{'mt-4': $vuetify.breakpoint.smAndDown, 'ma-0': $vuetify.breakpoint.smAndUp}">
                    <v-range-slider
                      dark
                      v-model="range"
                      :max="max"
                      :min="min"
                      step="5"
                      ticks
                      color="black"
                      thumb-color="black"
                      thumb-label="always"
                      :hint="range[0] + ' years old to ' + range[1] + ' years old'"
                      persistent-hint
                    ></v-range-slider>
                  </v-flex>
                </v-layout>
                <v-layout column class="mt-3">
                  <v-flex v-if="$vuetify.breakpoint.xs" class="mt-3"
                    xs12 sm3 offset-md2
                  >
                    <h3>
                      <span class="boxy">gender/s ⤵</span>
                    </h3>
                  </v-flex>
                  <v-flex>
                    <checkable-button
                      type="man"
                      tooltip="male"
                      value="M"
                      :arr="genders"
                      @add="add"
                      @remove="remove">
                    </checkable-button>
                    <checkable-button
                      type="woman"
                      tooltip="female"
                      value="F"
                      :arr="genders"
                      @add="add"
                      @remove="remove">
                    </checkable-button>
                    <checkable-button
                      type="unknown"
                      tooltip="unknown"
                      value="UNKNOWN"
                      :arr="genders"
                      @add="add"
                      @remove="remove">
                    </checkable-button>
                    <span v-if="$vuetify.breakpoint.smAndUp" style="display: inline-flex;"><h3 class="ml-5">
                      <span class="boxy">↩ gender/s</span>
                    </h3></span>
                  </v-flex>
                </v-layout>
                <v-layout column class="mt-5">
                  <v-flex>
                    <h3>
                      <span class="boxy">location ⤵</span>
                      <small class="white--text">(draw a circle around anywhere on the map...</small>
                    </h3>
                  </v-flex>
                  <location-map
                  @change-locations="setLocations">
                  </location-map>
                </v-layout>
                <v-layout column class="mt-5">
                  <v-flex v-if="$vuetify.breakpoint.xs" class="mt-2"
                    xs12 sm3 offset-md2
                  >
                    <h3>
                      <span class="boxy">relationship status ⤵</span>
                    </h3>
                  </v-flex>
                  <v-flex class="px-3">
                    <span v-if="$vuetify.breakpoint.smAndUp" style="display: inline-flex;"><h3 class="ml-3">
                      <span class="boxy">relationship status ↪</span>
                    </h3></span>
                    <checkable-button
                      type="unknown"
                      tooltip="don't care"
                      :value="null"
                      :update="updateRelationship"
                      ref="component1">
                    </checkable-button>
                    <checkable-button
                      type="single"
                      tooltip="preferably single"
                      :value="false"
                      :update="updateRelationship"
                      ref="component2">
                    </checkable-button>
                    <checkable-button
                      type="couple"
                      tooltip="couple"
                      :value="true"
                      :update="updateRelationship"
                      ref="component3">
                    </checkable-button>
                  </v-flex>
                </v-layout>
                <v-layout column class="mt-5">
                  <v-flex v-if="$vuetify.breakpoint.xs" class="mt-0"
                    xs12 sm3 offset-md2
                  >
                    <h3>
                      <span class="boxy">should they have kids? ⤵</span>
                    </h3>
                  </v-flex>
                  <v-flex class="px-3">
                    <checkable-button
                      type="unknown"
                      tooltip="don't care"
                      :value="null"
                      :update="updateKids"
                      ref="component5">
                    </checkable-button>
                    <checkable-button
                      type="no_baby"
                      tooltip="preferably not"
                      :value="false"
                      :update="updateKids"
                      ref="component6">
                    </checkable-button>
                    <checkable-button
                      type="baby"
                      tooltip="preferably yes"
                      :value="true"
                      :update="updateKids"
                      ref="component7">
                    </checkable-button>
                    <span v-if="$vuetify.breakpoint.smAndUp" style="display: inline-flex;"><h3 class="ml-3">
                      <span class="boxy">↩ should they have kids?</span>
                    </h3></span>
                  </v-flex>
                </v-layout>
                <v-layout row wrap class="mt-5">
                  <v-flex offset-sm1
                    xs12 sm4
                  >
                    <v-layout column>
                      <h3>
                        <span class="boxy">personality range ↪</span>
                      </h3>
                      <p class="black--text mb-0">basically a kindness scale</p>
                      <p class="black--text">filters between critical and kind</p>
                    </v-layout>
                  </v-flex>
                  <v-flex class="px-3" xs12 sm6>
                    <v-range-slider
                      light
                      v-model="sentiment_range"
                      max="100"
                      min="0"
                      color="black"
                      thumb-color="black"
                      thumb-label="always"
                      :hint="'<span class=\'black--text\'>from ' + niceness(sentiment_range[0]) + ' to ' + niceness(sentiment_range[1]) + '</span>'"
                      persistent-hint
                    ></v-range-slider>
                  </v-flex>
                </v-layout>
                <v-layout column>
                  <v-flex v-if="$vuetify.breakpoint.xs" class="mt-5"
                    xs12 sm3 offset-md2
                  >
                    <h3>
                      <span class="boxy">preffered video style ⤵</span>
                    </h3>
                  </v-flex>
                  <v-flex class="px-3">
                    <v-btn @click="prefer_vlog = false">topical</v-btn>
                    <v-btn @click="prefer_vlog = true">daily life/ vlog style</v-btn>
                    <v-btn @click="prefer_vlog = null">anything goes</v-btn>
                    <span v-if="$vuetify.breakpoint.smAndUp" style="display: inline-flex;"><h3 class="ml-3">
                      <span class="boxy">↩ preffered video style</span>
                    </h3></span>
                  </v-flex>
                  <div class="black--text mt-2">
                    <span v-if="prefer_vlog == false">
                      topical. i like my videos to have a theme
                    </span>
                    <span v-else-if="prefer_vlog == true">
                      daily life. i like videos that tell the story of someones life
                    </span>
                    <span v-else>
                      literally anything goes
                    </span>
                  </div>
                </v-layout>
                <v-layout row wrap class="mt-5">
                  <v-flex
                    xs12 sm5
                  >
                    <h3>
                      <span class="boxy">ideal average video length ↪</span>
                    </h3>
                  </v-flex>
                  <v-flex :class="{'mt-4': $vuetify.breakpoint.smAndDown, 'ma-0': $vuetify.breakpoint.smAndUp}" xs12 sm7>
                    <v-slider
                      light
                      v-model="average_length"
                      max="60"
                      min="0"
                      color="black"
                      thumb-color="black"
                      thumb-label="always"
                      :hint="'<span class=\'black--text\'>around ' + format_duration(average_length) + '</span>'"
                      persistent-hint
                    ></v-slider>
                  </v-flex>
                </v-layout>
                <v-layout column class="mt-5">
                  <h3 class="ml-3">
                    <span class="boxy">how important is <span v-if="$vuetify.breakpoint.smAndUp">video editing/ </span>cinematography to you? ⤵</span>
                  </h3>
                  <v-rating
                    v-model="rating"
                    length="5"
                    hover
                    empty-icon="fas fa-video"
                    full-icon="fas fa-video"
                    color="white"
                    background-color="black"
                  >
                  </v-rating>
                  <div class="black--text">
                    <span v-if="rating == 1">
                      i couldn't care less
                    </span>
                    <span v-else-if="rating == 2">
                      as long as it's easy to follow
                    </span>
                    <span v-else-if="rating == 3">
                      i'm fine with simple editing
                    </span>
                    <span v-else-if="rating == 4">
                      keep it professional, but nothing too fancy
                    </span>
                    <span v-else>
                      nothing short of the best
                    </span>
                  </div>
                </v-layout>
                <v-layout column class="mt-4">
                  <h3 class="ml-3">
                    <span class="boxy">how about the storytelling?</span>
                  </h3>
                  <v-rating
                    v-model="personality"
                    length="5"
                    hover
                    empty-icon="local_library"
                    full-icon="local_library"
                    color="white"
                    background-color="black"
                  >
                  </v-rating>
                  <div class="black--text">
                    <span v-if="personality == 1">
                      i couldn't care less
                    </span>
                    <span v-else-if="personality == 2">
                      anything remotely interesting is still more interesting than my life, so i'll take it
                    </span>
                    <span v-else-if="personality == 3">
                      preferably someone who's life is filled with both interesting and mundane parts
                    </span>
                    <span v-else-if="personality == 4">
                      keep it interesting
                    </span>
                    <span v-else>
                      keep it <i>really</i> interesting
                    </span>
                  </div>
                </v-layout>
                <div id="element"></div>
                <v-btn
                  :loading="searching"
                  :disabled="searching"
                  style="background-color: #77F8EA !important;"
                  color="#77F8EA"
                  class="mt-5"
                  @click.native="search"
                >
                  Search
                  <span slot="loader" class="custom-loader">
                    <v-icon light>cached</v-icon>
                  </span>
                </v-btn>
                <v-alert
                  class="mt-3"
                  :value="search_message"
                  :type="search_message_type"
                >
                  {{search_message}}
                </v-alert>
              </v-card-text>
            </v-container>
        </header>
        <v-container>
          <v-slide-y-transition>
            <v-progress-circular v-show="hide_batch && search_response.length > 0"
              :size="70"
              :width="7"
              color="black"
              indeterminate
            ></v-progress-circular>
          </v-slide-y-transition>
          <v-fade-transition>
            <div v-show="!hide_batch">
              <div v-if="!hide_batch" v-for="data in currentBatch">
                <youtuber :data="data.root" :percentage="data.percentage">
                </youtuber>
              </div>
            </div>
          </v-fade-transition>
          <v-layout row justify-center mt-5 v-if="search_response.length > 0">
            <v-btn v-scroll-to="'#element'" icon color="white" :disabled="current_index == 0 || hide_batch" @click="current_index -= 5">
              <v-icon>arrow_left</v-icon>
            </v-btn>
            <v-btn icon color="white" :disabled="(search_response.length - current_index - 5) < 0 || hide_batch" v-scroll-to="'#element'" @click="current_index += 5">
              <v-icon>arrow_right</v-icon>
            </v-btn>
          </v-layout>
        </v-container>
    </div>
</template>

<script>
import UserSummary from 'components/UserSummary'
import CheckableButton from 'components/CheckableButton'
import LocationMap from 'components/LocationMap'
import Youtuber from 'components/Youtuber'

import Rellax from 'rellax'

import $ from 'jquery'

export default {
  name: 'core',
  components: {
      UserSummary,
      CheckableButton,
      LocationMap,
      Youtuber
  },
  data () {
    return {
      menu: false,
      average_length: 20,
      rating: 3,
      value: 0,
      style: 'anything goes',
      genders: [],
      sentiment_range: [40, 100],
      duration_range: [0, 320],
      min: 0,
      max: 120,
      slider: 40,
      range: [20, 35],
      search_response: [],
      locations: [],
      searching: false,
      search_message: null,
      search_message_type: 'error',
      current_index: 0,
      hide_batch: false,
      prefer_relationship: null,
      prefer_kids: null,
      prefer_vlog: null,
      personality: 3,
      tags: [],
      input_tag: null,
      preassigned_tags: [
        {
          name: 'travel',
          tags: [
            'travel',
            'flying',
            'cruise',
            'shopping',
            'tour',
            'africa',
            'asia',
            'europe',
            'america',
            'oceania'
          ]
        },
        {
          name: 'beauty',
          tags: [
            'makeup',
            'beauty',
            'skincare',
            'clothing',
            'try on haul',
            'lashes',
            'style',
            'outfit',
            'michelle phan',
            'rachel levin',
            'zoella'
          ]
        },
        {
          name: 'gaming',
          tags: [
            'gaming',
            'game',
            'playstation',
            'nintendo',
            'xbox',
            'lets play',
            'review',
            'pewdiepie',
            'markiplier'
          ]
        },
        {
          name: 'comedy',
          tags: [
            'comedy',
            'skit',
            'ryan higa',
            'jenna marbles'
          ]
        },
        {
          name: 'tech',
          tags: [
            'technology',
            'iphone',
            'android',
            'drone',
            'photography',
            'review',
            'mkbhd',
            'unbox therapy'
          ]
        },
        {
          name: 'lifestyle',
          tags: [
            'lifestyle',
            'challenge',
            'vlog',
            'bethany mota',
            'alisha mare'
          ]
        }
      ]
    }
  },
  computed: {
    currentBatch: function() {
      this.hide_batch = true
      if ((this.search_response.length - this.current_index - 5) > 0) {
        var batch = this.search_response.slice(this.current_index, this.current_index + 5)
        return batch
      } else {
        var batch = this.search_response.slice(this.current_index, this.search_response.length)
        return batch
      }
    }
  },
  watch: {
    genders: function() {
      if (this.genders.length == 0) {
        this.search_message_type = 'warning'
        this.search_message = "you haven't selected any genders! so you aren't going to find *anybody*"
      } else {
        this.search_message = null
      }
    },
    currentBatch() {
      var vm = this
      setTimeout(function () {
        vm.hide_batch = false
      }, 5000);
    }
  },
  mounted: function() {
    var rellax = new Rellax('.rellax');
    this.genders = []
  },
  methods: {
    setLocations: function(found_countries) {
      this.locations = found_countries
    },
    add: function(arr, val) {
      if (!arr.includes(val)) {
        arr.push(val)
      }
    },
    remove: function(arr, val) {
      if (arr.includes(val)) {
        var index = arr.indexOf(val);
        arr.splice(index, 1)
      }
    },
    removeTag: function(tag) {
      var index = this.tags.indexOf(tag);
      if (index > -1) {
        this.tags.splice(index, 1);
      }
    },
    addTag: function() {
      var tags = this.input_tag.toLowerCase().split(',')
      for (let tag of tags) {
        var index = this.tags.indexOf(tag);
        if (index == -1) {
          this.tags.push(tag)
        }
      }
      this.input_tag = null
    },
    addTags: function(tags) {
      for (let tag of tags) {
        var index = this.tags.indexOf(tag);
        if (index == -1) {
          this.tags.push(tag)
        }
      }
    },
    niceness: function(value100) {
      var value = value100/100
      var speech = ` (${value100}% kind)`
      if (value < 0.2) return '<i>very</i> critical' + speech
      else if (value < 0.3) return 'critical' + speech
      else if (value < 0.4) return '<i>kinda</i> harsh' + speech
      else if (value < 0.5) return 'harsh but fair' + speech
      else if (value < 0.6) return 'average' + speech
      else if (value < 0.7) return 'nice' + speech
      else if (value < 0.8) return 'good' + speech
      else if (value < 0.9) return 'kind' + speech
      else if (value <= 1) return '<i>really</i> nice' + speech
    },
    updateRelationship: function(val) {
      this.prefer_relationship = val
      this.$refs.component1.checked = false
      this.$refs.component2.checked = false
      this.$refs.component3.checked = false
      switch(val) {
        case null: this.$refs.component1.checked = true; break;
        case false: this.$refs.component2.checked = true; break;
        case true: this.$refs.component3.checked = true; break;
      }
    },
    updateKids: function(val) {
      this.prefer_kids = val
      this.$refs.component5.checked = false
      this.$refs.component6.checked = false
      this.$refs.component7.checked = false
      switch(val) {
        case null: this.$refs.component5.checked = true; break;
        case false: this.$refs.component6.checked = true; break;
        case true: this.$refs.component7.checked = true; break;
      }
    },
    search: function() {
      var data = {
      	"age_range": this.range,
      	"gender": this.genders,
      	"duration": this.average_length,
      	"sentiment_range": [this.sentiment_range[0]/100, this.sentiment_range[1]/100],
      	"prefer_kids": this.prefer_kids,
      	"prefer_relationship": this.prefer_relationship,
      	"videography": this.rating,
      	"storytelling": this.personality,
      	"personality": this.personality,
      	"tags": this.tags,
      	"locations": this.locations
      }
      if (this.prefer_vlog == false) {
        data["prefer_topical"] = true
      } else if (this.prefer_vlog == true) {
        data["prefer_vlog"] = true
      }
      console.log(JSON.stringify(data))
      var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://findanewvlogger.herokuapp.com/search",
        "method": "POST",
        "headers": {
          "Content-Type": "application/json",
          "cache-control": "no-cache",
          "Postman-Token": "c0b967ef-9bee-42cd-aa75-a3d37174583b"
        },
        "processData": false,
        "data": JSON.stringify(data)
      }

      this.searching = true

      var vm = this
      $.ajax(settings).done(function (response) {
        vm.current_index = 0
        vm.search_response = response;
        console.log(vm.search_response.length)
        if (vm.search_response.length == 0) {
          vm.search_message_type = 'error'
          vm.search_message = "no suitable youtubers found. try tweaking some of the settings."
        } else {
          vm.search_message = null
        }
        vm.searching = false
      });
    },
    format_duration: function(duration) {
      return (duration < 60) ? duration + ' minutes' :
        Math.floor(duration/60) + ' hours, ' + duration%60 + ' minutes'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="css">

@font-face {
    font-family: 'Neo Sans Arabic';
    src: url('../assets/NeoSansArabic.woff2') format('woff2'),
        url('../assets/NeoSansArabic.woff') format('woff');
    font-weight: normal;
    font-style: normal;
}

    .application {
        font-family: 'Neo Sans Arabic'; font-weight: normal; font-style: normal;
    }
    body {
      background-color: #E53F35;
    }
    #app {
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-align: center;
      color: #cad6e6;
    }
    a {
        color: #6edbff;

        &:hover, &:focus {
            color: lighten(#6edbff, 10);
        }
    }

    header {
        position: relative;
        padding: 2rem 0 2rem;
        margin-bottom: 3rem;
        overflow: hidden;
    }
    .wrapper {
  display: flex;
  flex-direction: column;
  align-items: center; /* Horizontal alignment */
}
@media only screen and (max-device-width : 640px) {
  h3 {
    font-size: 4vw !important;
  }
  .bg-img {
    height: 80vh;
    width: auto;
    object-fit: cover;
  }
}

h1 {
    font-weight: bold;
  margin-bottom: 0px;
  position: relative;
  z-index: 5;
}

h1>.boxy {
  box-shadow: -10px -10px;
}

h3>.boxy {
  box-shadow: -10px -10px;
}

h4>.boxy {
  border-style: solid;
  border-width: 4px;
  box-shadow: 10px 10px;
}

.boxy {
  background-color: white;
  border-radius: 2px;
  color: black;
  padding: 10px;
}

button {
  border-style: solid;
  border-color: black;
  border-width: 4px;
  box-shadow: 10px 10px !important;
  text-transform: lowercase !important;
}
button:hover {
  box-shadow: 0px 0px !important;
}
.v-text-field--solo .v-input__slot {
  box-shadow: 10px 10px rgba(255, 255, 255, 0.5) !important;
  transition: .3s cubic-bezier(.25,.8,.5,1) !important;
  text-transform: lowercase !important;
}
.v-input__slot:hover {
  box-shadow: 0px 0px rgba(255, 255, 255, 0.5) !important;
}
.bg-img {
  position: absolute;
  width: 100%;
  left: 0;
}

.v-alert {
  box-shadow: 10px 10px black !important;
}
.v-alert:hover {
  box-shadow: 0px 0px !important;
}

.custom-loader {
    animation: loader 1s infinite;
    display: flex;
  }
  @-moz-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-webkit-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-o-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
