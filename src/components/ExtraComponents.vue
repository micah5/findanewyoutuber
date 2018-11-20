<template>
    <v-layout row wrap class="mt-5">
      <v-flex xs12 sm2 offset-sm2 class="mb-5">
        <v-layout column>
          <h3>
            <span class="boxy">gender/s</span>
          </h3>
          <v-flex :class="{'mt-4 pa-3': $vuetify.breakpoint.smAndDown, 'mt-3': $vuetify.breakpoint.smAndUp}">
            <checkable-button
              type="man"
              tooltip="male"
              value="male"
              :arr="tags"
              @add="add"
              @remove="remove">
            </checkable-button>
            <checkable-button
              type="woman"
              tooltip="female"
              value="female"
              :arr="tags"
              @add="add"
              @remove="remove">
            </checkable-button>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex xs12 sm7 class="mb-5">
        <v-layout column>
          <h3>
            <span class="boxy">personality types</span>
          </h3>
          <v-flex :class="{'mt-4 pa-3': $vuetify.breakpoint.smAndDown, 'mt-3': $vuetify.breakpoint.smAndUp}">
            <checkable-button
              type="fun"
              tooltip="fun/ positive"
              value="fun"
              :arr="tags"
              @add="add"
              @remove="remove">
            </checkable-button>
            <checkable-button
              type="critical"
              tooltip="critical"
              value="critical"
              :arr="tags"
              @add="add"
              @remove="remove">
            </checkable-button>
            <checkable-button
              type="nonchelant"
              tooltip="nonchelant"
              value="nonchelant"
              :arr="tags"
              @add="add"
              @remove="remove">
            </checkable-button>
            <checkable-button
              type="crazy"
              tooltip="avoid overexcited"
              value="avoid overexcited"
              :arr="tags"
              @add="add"
              @remove="remove">
            </checkable-button>
            <checkable-button
              type="angry"
              tooltip="avoid angry"
              value="avoid angry"
              :arr="tags"
              @add="add"
              @remove="remove">
            </checkable-button>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex xs12 class="mb-5">
        <v-layout column>
          <h3>
            <span class="boxy">categories</span>
          </h3>
          <v-flex :class="{'mt-4 pa-3': $vuetify.breakpoint.smAndDown, 'mt-3': $vuetify.breakpoint.smAndUp}">
            <checkable-button
              type="vlog"
              tooltip="vlogging"
              value="vlogging"
              :arr="tags"
              @add="add"
              @remove="remove">
            </checkable-button>
            <checkable-button
              type="drama"
              tooltip="drama/ comedy"
              value="drama"
              :arr="tags"
              @add="add"
              @remove="remove">
            </checkable-button>
            <checkable-button
              type="animation"
              tooltip="animation"
              value="animation"
              :arr="tags"
              @add="add"
              @remove="remove">
            </checkable-button>
            <checkable-button
              type="travel"
              tooltip="travel"
              value="travel"
              :arr="tags"
              @add="add"
              @remove="remove">
            </checkable-button>
            <checkable-button
              type="pets"
              tooltip="pets"
              value="pets"
              :arr="tags"
              @add="add"
              @remove="remove">
            </checkable-button>
            <checkable-button
              type="sports"
              tooltip="sports"
              value="sports"
              :arr="tags"
              @add="add"
              @remove="remove">
            </checkable-button>
            <checkable-button
              type="documentary"
              tooltip="documentary"
              value="documentary"
              :arr="tags"
              @add="add"
              @remove="remove">
            </checkable-button>
            <checkable-button
              type="fashion"
              tooltip="fashion"
              value="fashion"
              :arr="tags"
              @add="add"
              @remove="remove">
            </checkable-button>
            <checkable-button
              type="podcast"
              tooltip="podcast"
              value="podcast"
              :arr="tags"
              @add="add"
              @remove="remove">
            </checkable-button>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex xs12 sm6 offset-sm3 class="mt-3 pl-3 pr-3">
        <v-layout column>
          <h3>
            <span class="boxy">age range</span>
          </h3>
          <v-flex :class="{'mt-4 pa-3': $vuetify.breakpoint.smAndDown, 'mt-5': $vuetify.breakpoint.smAndUp}">
            <v-range-slider
              light
              v-model="range"
              :max="max"
              :min="min"
              step="5"
              ticks
              color="black"
              thumb-color="black"
              thumb-label="always"
              :hint="range[0] + ' years old to ' + range[1] + ' years old'"
              hint-color="black"
              persistent-hint
            ></v-range-slider>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-layout column class="mt-5">
        <v-flex>
          <h3>
            <span class="boxy">location ⤵</span>
            <small class="black--text">(draw a circle around anywhere on the map...</small>
          </h3>
        </v-flex>
        <location-map
        @change-locations="setLocations">
        </location-map>
      </v-layout>
    </v-layout>
</template>

<script>
import UserSummary from 'components/UserSummary'
import CheckableButton from 'components/CheckableButton'
import LocationMap from 'components/LocationMap'
import Youtuber from 'components/Youtuber'

import $ from 'jquery'

export default {
  name: 'extra-components',
  props: [
    'tags'
  ],
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
      min: 18,
      max: 118,
      slider: 40,
      range: [18, 35],
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
      input_tag: null,
      categories: []
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
    },
    range: function() {
      for (let tag of this.tags) {
        if (tag.startsWith('aged ') || tag.endsWith(' years old')) {
          var index = this.tags.indexOf(tag);
          this.tags.splice(index, 1)
        }
      }
      if (this.range[0] == this.range[1]) {
        this.tags.push(this.range[0] + ' years old')
      } else {
        this.tags.push('aged ' + this.range[0] + ' - ' + this.range[1])
      }
    }
  },
  mounted: function() {
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
    format_duration: function(duration) {
      return (duration < 60) ? duration + ' minutes' :
        Math.floor(duration/60) + ' hours, ' + duration%60 + ' minutes'
    }
  }
}
</script>
