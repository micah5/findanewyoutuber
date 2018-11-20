<template>
  <div style="height: 100vh;">
    <img class="bg-img rellax" data-rellax-speed="-6" src="../assets/bg/layer5.png"></img>
    <img class="bg-img rellax" data-rellax-speed="-4" src="../assets/bg/layer4.png"></img>
    <img class="bg-img rellax" data-rellax-speed="-2" src="../assets/bg/layer3.png" style="opacity: 0.6;"></img>
    <div style="width: 100%; height: 320vh; position: absolute; background-image: linear-gradient(transparent, #FBC02D, yellow); z-index: 2;" class="rellax" data-rellax-speed="2"></div>
    <v-layout row style="position: absolute; right: 0; top: 0;" class="pa-3">
      <a class="github-button" href="https://github.com/98mprice/findanewvlogger" data-icon="octicon-star" data-size="large" aria-label="Star 98mprice/findanewvlogger on GitHub">Star</a>
    </v-layout>
    <v-layout column style="position: absolute; top: 0px; width: 100%;" class="pt-4">
      <h1><span class="boxy">find a new youtuber</span></h1>
      <h3><span class="boxy" style="font-size: 0.8em;">personality based youtuber search <small>~ powered by reddit, ai & ❤</small></span></h3>
    </v-layout>
    <v-layout column style="position: absolute; bottom: -20px; width: 100%;">
      <p class="white--text">if you'd like some more suggestions for things to search, scroll below ⤵</p>
    </v-layout>
    <v-container bg fill-height grid-list-md text-xs-center style="padding-top: 20vh;">
      <v-layout row wrap align-center>
        <v-flex style="transform: translate(0, -50px); z-index: 3;">
          <h3 class="mb-0 white--text">what does your perfect youtuber look like?</h3>
          <h3 class="mt-0 white--text"><small>you can search a combination for things, people, places, ages, genders, personality types etc.</small></h3>
          <v-text-field class="test_input mb-3"
            hide-details
            v-model="input_tag"
            @keyup.enter.native="addTag"
            label="e.g. gaming, fashion, college, japan, casey neistat, female, 20 years old, fun, outgoing etc"
            solo
          ></v-text-field>
          <v-layout row wrap align-center>
            <v-flex class="text-xs-center">
              <v-btn
                color="white"
                v-for="tag in tags"
                @click="removeTag(tag)"
                >
                {{tag}}<small><v-icon>close</v-icon></small>
              </v-btn>
            </v-flex>
          </v-layout>
          <v-layout v-show="false" row wrap align-center>
            <v-flex class="text-xs-center">
              <p class="mb-0 white--text" style="display: inline-flex;">suggestions →</p>
              <v-btn
                class="suggest-btn grey--text"
                color="white"
                v-for="tag in tags"
                @click="removeTag(tag)"
                >
                {{tag}}<small><v-icon>add</v-icon></small>
              </v-btn>
            </v-flex>
          </v-layout>
          <v-btn
            v-show="tags.length > 0"
            :loading="searching"
            :disabled="searching"
            dark
            class="mt-4"
            @click.native="search"
          >
            Search<small><v-icon right>search</v-icon></small>
            <span slot="loader" class="custom-loader">
              <v-icon light>cached</v-icon>
            </span>
          </v-btn>
        </v-flex>
      </v-layout>
    </v-container>
    <h3 class="mt-5">
      <!--<span class="boxy">some more things you could search by...</span>-->
      <extra-components :tags="tags"></extra-components>
    </h3>
    <v-fade-transition>
      <div class="footer" v-show="scroll && tags.length > 0">
        <v-container bg fill-height grid-list-md text-xs-center>
          <v-layout row wrap align-center>
            <v-flex class="text-xs-center">
              <v-btn
                color="white"
                v-for="tag in tags"
                @click="removeTag(tag)"
                >
                {{tag}}<small><v-icon>close</v-icon></small>
              </v-btn>
            </v-flex>
          </v-layout>
        </v-container>
      </div>
  </v-fade-transition>
  </div>
</template>

<script>
import ExtraComponents from 'components/ExtraComponents'

import Rellax from 'rellax'

import $ from 'jquery'

export default {
  name: 'core2',
  components: {
      ExtraComponents
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
      scroll: false
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
  created () {
    window.addEventListener('scroll', this.handleScroll);
  },
  destroyed () {
    window.removeEventListener('scroll', this.handleScroll);
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
    handleScroll (event) {
      // Any code to be executed when the window is scrolled
      if ((window.innerHeight/3) < window.scrollY) {
        this.scroll = true
      } else {
        this.scroll = false
      }
    },
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
  z-index: 3;
  position: relative;
  box-shadow: -10px 10px rgba(255, 255, 255, 0.5);
}

h3 {
    z-index: 3;
    position: relative;
}

span {
    z-index: 3;
}

p {
  z-index: 3;
  position: relative;
}

.boxy {
  background-color: white;
  border-radius: 2px;
  color: black;
  padding: 10px;
}

button {
  z-index: 3;
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
  z-index: 3;
  position: relative;
  box-shadow: 10px 10px rgba(255, 255, 255, 0.5) !important;
  transition: .3s cubic-bezier(.25,.8,.5,1) !important;
  text-transform: lowercase !important;
}
.v-input__slot:hover {
  box-shadow: 0px 0px rgba(255, 255, 255, 0.5) !important;
}
.suggest-btn {
  box-shadow: 10px 10px rgba(255, 255, 255, 0.5) !important;
}
.suggest-btn:hover {
  box-shadow: 0px 0px rgba(255, 255, 255, 0.5) !important;
}
.bg-img {
  position: absolute;
  width: 100%;
  left: 0;
  z-index: 1;
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

.footer {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  background-color: rgba(254, 141, 0, 0.5);
  color: black;
  text-align: center;
  height: 30%;
  z-index: 3;
}

/* if backdrop support: very transparent and blurred */
@supports ((-webkit-backdrop-filter: blur(2em)) or (backdrop-filter: blur(2em))) {
  .footer {
    -webkit-backdrop-filter: blur(2em);
    backdrop-filter: blur(2em);
  }
}
</style>
