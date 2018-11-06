<template>
    <div id="main">
        <img class="bg-img rellax" data-rellax-speed="-6" src="../assets/bg/layer5.png"></img>
        <img class="bg-img rellax" data-rellax-speed="-4" src="../assets/bg/layer4.png"></img>
        <img class="bg-img rellax" data-rellax-speed="-2" src="../assets/bg/layer3.png"></img>
        <!--<img class="bg-img rellax" style="margin-top:200vh" data-rellax-speed="-4" src="../assets/bg/layer2.png"></img>
        <img class="bg-img rellax" style="margin-top:300vh" data-rellax-speed="-1" src="../assets/bg/layer1.png"></img>-->
        <div style="width: 100%; height: 600vh; position: absolute; background-image: linear-gradient(transparent, yellow, yellow, transparent);" class="rellax" data-rellax-speed="2"></div>
        <!--<div style="width: 100%; height: 300vh; position: absolute; margin-top: 750vh; background-image: linear-gradient(transparent, red, red, transparent);" class="rellax" data-rellax-speed="2"></div>-->
        <header>
            <v-container>
                <h1><span class="boxy">find a new vlogger</span></h1>
                <h3><span class="boxy">personality based youtuber search <small>~ powered by reddit, ai & ❤</small></span></h3>
                <h3 class="mt-5 white--text">what does your perfect youtuber look like?</h3>
                <v-layout row class="mt-5">
                  <v-flex
                    xs12 sm3 offset-sm2
                  >
                    <h3>
                      <span class="boxy">age range ↪</span>
                    </h3>
                  </v-flex>
                  <v-flex class="px-3" xs12 sm4>
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
                <v-layout row class="mt-3">
                  <v-flex class="px-3">
                    <checkable-button
                      type="man"
                      tooltip="male"
                      value="M"
                      @add-gender="addGender"
                      @remove-gender="removeGender">
                    </checkable-button>
                    <checkable-button
                      type="woman"
                      tooltip="female"
                      value="F"
                      @add-gender="addGender"
                      @remove-gender="removeGender">
                    </checkable-button>
                    <checkable-button
                      type="unknown"
                      tooltip="unknown"
                      value="UNKNOWN"
                      @add-gender="addGender"
                      @remove-gender="removeGender">
                    </checkable-button>
                    <span style="display: inline-flex;"><h3 class="ml-5">
                      <span class="boxy">↩ gender</span>
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
                <v-layout row class="mt-5">
                  <v-flex class="px-3">
                    <span style="display: inline-flex;"><h3 class="ml-3">
                      <span class="boxy">relationship ↪</span>
                    </h3></span>
                    <checkable-button
                      type="man"
                      tooltip="single">
                    </checkable-button>
                    <checkable-button
                      type="woman"
                      tooltip="couple">
                    </checkable-button>
                    <checkable-button
                      type="unknown"
                      tooltip="has kids">
                    </checkable-button>
                    <checkable-button
                      type="unknown"
                      tooltip="unknown">
                    </checkable-button>
                  </v-flex>
                </v-layout>
                <v-layout row class="mt-5">
                  <v-flex class="px-3" offset-sm2 xs12 sm5>
                    <v-range-slider
                      light
                      v-model="duration_range"
                      max="1000"
                      min="0"
                      color="black"
                      thumb-color="black"
                      thumb-label="always"
                      :hint="'<span class=\'black--text\'>min ' + format_duration(duration_range[0]) + ' to max ' + format_duration(duration_range[1]) + '</span>'"
                      persistent-hint
                    ></v-range-slider>
                  </v-flex>
                  <v-flex
                    xs12 sm3
                  >
                    <h3>
                      <span class="boxy">↩ video duration</span>
                    </h3>
                  </v-flex>
                </v-layout>
                <v-layout row class="mt-5">
                  <v-flex
                    xs12 sm5
                  >
                    <h3>
                      <span class="boxy">ideal average video length ↪</span>
                    </h3>
                  </v-flex>
                  <v-flex class="px-3" xs12 sm7>
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
                    <span class="boxy">how important is video editing to you? ⤵</span>
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
                <v-layout row class="mt-3">
                  <v-flex class="px-3">
                    <checkable-button
                      type="man"
                      tooltip="studying">
                    </checkable-button>
                    <checkable-button
                      type="woman"
                      tooltip="working">
                    </checkable-button>
                    <checkable-button
                      type="woman"
                      tooltip="nothing">
                    </checkable-button>
                    </checkable-button>
                    <span style="display: inline-flex;"><h3 class="ml-5">
                      <span class="boxy">↩ life stage</span>
                    </h3></span>
                  </v-flex>
                </v-layout>
                <v-layout column class="mt-5">
                  <v-flex class="px-3">
                    <v-btn @click="style='topical'">topical</v-btn>
                    <v-btn @click="style='daily life'">daily life</v-btn>
                    <v-btn @click="style='long form'">long form</v-btn>
                    <v-btn @click="style='anything goes'">anything goes</v-btn>
                    <span style="display: inline-flex;"><h3 class="ml-3">
                      <span class="boxy">↩ preffered video style</span>
                    </h3></span>
                  </v-flex>
                  <div class="black--text mt-2">
                    <span v-if="style=='topical'">
                      topical. i like my videos to have a theme
                    </span>
                    <span v-else-if="style=='daily life'">
                      daily life. i like videos that tell the story of someones life
                    </span>
                    <span v-else-if="style=='long form'">
                      long form. live streams, podcasts. i like it long
                    </span>
                    <span v-else>
                      literally anything goes
                    </span>
                  </div>
                </v-layout>
                <div id="element"></div>
                <v-btn
                  :loading="searching"
                  :disabled="searching"
                  style="background-color: #77F8EA !important;"
                  color="#77F8EA"
                  class="mt-3"
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
          <youtuber :data="testYoutuber[0]">
          </youtuber>
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
              <youtuber v-for="data in currentBatch" :data="data">
              </youtuber>
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
      average_length: 20,
      rating: 3,
      value: 0,
      style: 'anything goes',
      genders: [],
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
      testYoutuber: [
  {
    "max_duration": 998,
    "description": "Listen. I only hike to get to the location and take the photos. I do not enjoy hiking ... and I complain about it a lot... and you will hear my complaints in the vlogs. So if this is something like what you do? Come on join the family :) \n\nCamera: Sony A7iii\nLenses: Rokinon 12mm 2.0 (Real estate photography lens)\n               Sony 28mm 2.0 (Main vlogging and landscape lens)\n               Sony 28-70 (Kit lens that comes with me only sometimes)\nEditing done on Lightroom and Premiere Pro. RARELY PS. \nDoggo named Mercedes\nCatto named Mini\n\nThese are my adventures... complaints... and overall life.",
    "demographics": [
      {
        "gender": "M",
        "age": 34
      }
    ],
    "locations": [
      "seattle",
      "washington",
      "medina"
    ],
    "min_duration": 24,
    "sum_topical": 22,
    "avg_duration": 301.257143,
    "avg_sentiment_pred": 0.5921718168717164,
    "std_dev_duration": 269.45515209696146,
    "id": "UCF_bPUbcMoXTYg1AgMKocVw",
    "video_tags": [
      "canon full frame mirrorless",
      "nikon z7 vs canon eos r",
      "mirrorless camera 2018",
      "Canon beats nikon and sony mirroless",
      "Canon EOS R beats Sony and Nikon Mirrorless in one feature",
      "Canon EOS R beats Sony and Nikon Mirrorless",
      "Is the Canon EOS R a better camera",
      "Is the Canon EOS R a better camera than nikon",
      "Is the Canon EOS R a better camera than nikon and sony",
      "Canon closed shutter",
      "canon eos r closed shutter",
      "canon eos r mirroless",
      "canon mirrorless shutter"
    ],
    "relationship_perc": 0.5,
    "sentiment_pred": [
      {
        "pred": [
          0.8866044282913208
        ],
        "video_id": "0jxl4lMg7vU",
        "type_pred": "topical",
        "title": "The Beard Club Review (Formerly known as \"The Dollar Beard Club\""
      },
      {
        "pred": [
          0.7754899263381958
        ],
        "video_id": "K4dop954DN8",
        "type_pred": "topical",
        "title": "Dollar Beard Club product review"
      },
      {
        "pred": [
          0.8891989588737488
        ],
        "video_id": "v5RtV-Igzks",
        "type_pred": "vlog",
        "title": "You just bought your first camera. What now?"
      },
      {
        "pred": [
          0.7185632586479187
        ],
        "video_id": "6wDOWJv1mZk",
        "type_pred": "topical",
        "title": "DJI Mavic 2 Pro | Changing the color with a new skin"
      },
      {
        "pred": [
          0.17768985033035278
        ],
        "video_id": "V1H2_HdbqMc",
        "type_pred": "topical",
        "title": "Automotive Photoshoot | Vlog | A7iii | 4k"
      },
      {
        "pred": [
          0.6848529577255249
        ],
        "video_id": "WaSGjO8zCN4",
        "type_pred": "topical",
        "title": "Coal Creek Falls, WA hike || A7iii cinematic vlog || 4k ||"
      },
      {
        "pred": [
          0.24884718656539917
        ],
        "video_id": "-3MUAA4ONw0",
        "type_pred": "topical",
        "title": "Stump house | A7iii + 16 to 35 F4 Vlog"
      },
      {
        "pred": [
          0.1494450569152832
        ],
        "video_id": "YHGVUpw_Kas",
        "type_pred": "topical",
        "title": "Devil's Punchbowl Hike | A7iii + 16-35 F4 Vlog"
      },
      {
        "pred": [
          0.4680120050907135
        ],
        "video_id": "9vjrUprJQJA",
        "type_pred": "topical",
        "title": "Engagement Photos Vlog | A7iii | 4k | Nathan/Lesley"
      },
      {
        "pred": [
          0.8425877094268799
        ],
        "video_id": "BNOAJs0AjmM",
        "type_pred": "topical",
        "title": "Steilacoom | DJI Mavic 2 Pro | DLog-M Cinematic Mode with Hyperlapse"
      },
      {
        "pred": [
          0.3894774913787842
        ],
        "video_id": "hm6rxBy_two",
        "type_pred": "topical",
        "title": "Sony #BeAlpha Seattle Meetup"
      },
      {
        "pred": [
          0.8997064828872681
        ],
        "video_id": "mkpeRL8n30c",
        "type_pred": "topical",
        "title": "The Beard Club Review 2018"
      },
      {
        "pred": [
          0.9131386280059814
        ],
        "video_id": "8JDvy0CcIwc",
        "type_pred": "vlog",
        "title": "Jefferson Lake, WA: Hiking and Vlogging with the A7iii"
      },
      {
        "pred": [
          0.14397311210632324
        ],
        "video_id": "7ym0VJ3MY4o",
        "type_pred": "topical",
        "title": "Cascadia | Mavic 2 Pro Flying over water | DLog-M"
      },
      {
        "pred": [
          0.792441189289093
        ],
        "video_id": "IYd1nnvEbUM",
        "type_pred": "topical",
        "title": "Canon EOS R beats Sony and Nikon Mirrorless in one feature"
      },
      {
        "pred": [
          0.6094638109207153
        ],
        "video_id": "PD1yUXKHAXk",
        "type_pred": "topical",
        "title": "A7iii B Roll in S-Log2 with 16-35 F4 120fps"
      },
      {
        "pred": [
          0.6770790219306946
        ],
        "video_id": "2kBkLmVHaHE",
        "type_pred": "topical",
        "title": "Lake Cushman and Staircase Hike: First vlog with the A7iii in 4k:"
      },
      {
        "pred": [
          0.7448636889457703
        ],
        "video_id": "mvi-66FBCqo",
        "type_pred": "topical",
        "title": "A walk in Defiance"
      },
      {
        "pred": [
          0.10148739814758301
        ],
        "video_id": "JVIIdJvHmpY",
        "type_pred": "topical",
        "title": "Freedom at Franklin Falls"
      },
      {
        "pred": [
          0.9356649518013
        ],
        "video_id": "kJgk1vbsRic",
        "type_pred": "vlog",
        "title": "Exploring Cushman"
      },
      {
        "pred": [
          0.5740289688110352
        ],
        "video_id": "bDRfrB6l4Es",
        "type_pred": "topical",
        "title": "Cocoa at Cushman"
      },
      {
        "pred": [
          0.6590021252632141
        ],
        "video_id": "03RjGhAe-dE",
        "type_pred": "topical",
        "title": "Mavic Pro 4k Test footage"
      },
      {
        "pred": [
          0.28518930077552795
        ],
        "video_id": "FGcehXbops4",
        "type_pred": "vlog",
        "title": "Operation Candle: Trying a new smell"
      },
      {
        "pred": [
          0.9379882216453552
        ],
        "video_id": "Fz8KEJds4ww",
        "type_pred": "topical",
        "title": "Beard Product Review: Rustic Ron Co"
      },
      {
        "pred": [
          0.6864112019538879
        ],
        "video_id": "jz44G3NIzI4",
        "type_pred": "topical",
        "title": "Samung S7 unboxing and S6 comparison with spice"
      },
      {
        "pred": [
          0.20526030659675598
        ],
        "video_id": "Hd1jgqHNp_M",
        "type_pred": "topical",
        "title": "Dom's Adventures #1"
      }
    ],
    "reddit_username": "Domphotog",
    "country": "US",
    "video_id": "IYd1nnvEbUM",
    "found_phrases": [
      "what's up everyone",
      "all right so"
    ],
    "name": "Dominic Wilkerson",
    "most_occur": [
      [
        "i",
        659
      ],
      [
        "the",
        487
      ],
      [
        "to",
        442
      ],
      [
        "a",
        396
      ],
      [
        "it",
        380
      ],
      [
        "and",
        336
      ],
      [
        "you",
        311
      ],
      [
        "that",
        286
      ],
      [
        "like",
        257
      ],
      [
        "this",
        255
      ],
      [
        "so",
        251
      ],
      [
        "of",
        199
      ],
      [
        "is",
        193
      ],
      [
        "my",
        164
      ],
      [
        "i'm",
        159
      ],
      [
        "it's",
        152
      ],
      [
        "in",
        151
      ],
      [
        "but",
        144
      ],
      [
        "for",
        128
      ],
      [
        "just",
        124
      ],
      [
        "don't",
        121
      ],
      [
        "go",
        120
      ],
      [
        "what",
        116
      ],
      [
        "on",
        116
      ],
      [
        "[music]",
        116
      ],
      [
        "out",
        114
      ],
      [
        "here",
        111
      ],
      [
        "get",
        108
      ],
      [
        "me",
        106
      ],
      [
        "right",
        105
      ],
      [
        "was",
        103
      ],
      [
        "up",
        102
      ],
      [
        "there",
        98
      ],
      [
        "see",
        93
      ],
      [
        "oh",
        92
      ],
      [
        "be",
        91
      ],
      [
        "gonna",
        91
      ],
      [
        "do",
        89
      ],
      [
        "not",
        85
      ],
      [
        "all",
        83
      ],
      [
        "really",
        82
      ],
      [
        "can",
        81
      ],
      [
        "with",
        80
      ],
      [
        "know",
        79
      ],
      [
        "if",
        79
      ],
      [
        "have",
        78
      ],
      [
        "we",
        78
      ],
      [
        "now",
        71
      ],
      [
        "got",
        71
      ],
      [
        "that's",
        70
      ],
      [
        "or",
        69
      ],
      [
        "your",
        67
      ],
      [
        "one",
        67
      ],
      [
        "some",
        63
      ],
      [
        "about",
        59
      ],
      [
        "want",
        57
      ],
      [
        "little",
        56
      ],
      [
        "are",
        56
      ],
      [
        "guys",
        56
      ],
      [
        "going",
        55
      ],
      [
        "more",
        53
      ],
      [
        "think",
        53
      ],
      [
        "okay",
        52
      ],
      [
        "how",
        50
      ],
      [
        "um",
        49
      ],
      [
        "then",
        48
      ],
      [
        "yeah",
        48
      ],
      [
        "actually",
        47
      ],
      [
        "way",
        47
      ],
      [
        "let's",
        46
      ],
      [
        "kind",
        46
      ],
      [
        "they",
        46
      ],
      [
        "as",
        43
      ],
      [
        "at",
        42
      ],
      [
        "back",
        41
      ],
      [
        "look",
        39
      ],
      [
        "no",
        39
      ],
      [
        "well",
        39
      ],
      [
        "down",
        39
      ],
      [
        "there's",
        39
      ],
      [
        "nice",
        38
      ],
      [
        "stuff",
        37
      ],
      [
        "bit",
        36
      ],
      [
        "pretty",
        36
      ],
      [
        "i've",
        36
      ],
      [
        "take",
        36
      ],
      [
        "because",
        35
      ],
      [
        "time",
        35
      ],
      [
        "we're",
        34
      ],
      [
        "beard",
        33
      ],
      [
        "[applause]",
        32
      ],
      [
        "two",
        30
      ],
      [
        "something",
        30
      ],
      [
        "them",
        30
      ],
      [
        "even",
        30
      ],
      [
        "try",
        30
      ],
      [
        "good",
        30
      ],
      [
        "been",
        29
      ],
      [
        "over",
        29
      ],
      [
        "could",
        29
      ]
    ],
    "sum_vlog": 4,
    "kids_perc": 1,
    "video_category": "22",
    "thumbnail": "AN66SAyqGAUAMQssJ8NF2niz-x3EoeElFKCm23OGMw=s800-mo-c-c0xffffffff-rj-k-no.png",
    "avg": 0.65424432
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
    addGender: function(gender) {
      if (!this.genders.includes(gender)) {
        this.genders.push(gender)
      }
    },
    removeGender: function(gender) {
      if (this.genders.includes(gender)) {
        var index = this.genders.indexOf(gender);
        this.genders.splice(index, 1)
      }
    },
    search: function() {
      var data = {
        min_age: this.range[0],
        max_age: this.range[1],
        genders: this.genders,
        min_duration: this.duration_range[0],
        max_duration: this.duration_range[1],
        locations: this.locations,
        avg_duration: this.average_length
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
        vm.search_response = JSON.parse(response);
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
}

h1 {
    font-weight: bold;
  margin-bottom: 0px;
  position: relative;
  z-index: 5;
}

h1>.boxy {
  border-style: solid;
  border-width: 4px 4px 0 4px; /* No border at the bottom */
  box-shadow: -10px -10px;
}

h3>.boxy {
  border-style: solid;
  border-width: 4px;
  box-shadow: -10px -10px;
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
