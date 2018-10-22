<template>
    <div id="main">
        <img class="bg-img rellax" data-rellax-speed="-6" src="../assets/bg/layer5.png"></img>
        <img class="bg-img rellax" data-rellax-speed="-4" src="../assets/bg/layer4.png"></img>
        <img class="bg-img rellax" data-rellax-speed="-2" src="../assets/bg/layer3.png"></img>
        <img class="bg-img rellax" style="margin-top:200vh" data-rellax-speed="-4" src="../assets/bg/layer2.png"></img>
        <img class="bg-img rellax" style="margin-top:300vh" data-rellax-speed="-1" src="../assets/bg/layer1.png"></img>
        <div style="width: 100%; height: 600vh; position: absolute; background-image: linear-gradient(transparent, yellow, yellow, transparent);" class="rellax" data-rellax-speed="2"></div>
        <div style="width: 100%; height: 300vh; position: absolute; margin-top: 750vh; background-image: linear-gradient(transparent, red, red, transparent);" class="rellax" data-rellax-speed="2"></div>
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
                      tooltip="male">
                    </checkable-button>
                    <checkable-button
                      type="woman"
                      tooltip="female">
                    </checkable-button>
                    <checkable-button
                      type="unknown"
                      tooltip="unknown">
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
                  <location-map>
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
                      max="300"
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
              </v-card-text>
            </v-container>
        </header>
        <v-container>
          <youtuber></youtuber>
        </v-container>
    </div>
</template>

<script>
import UserSummary from 'components/UserSummary'
import CheckableButton from 'components/CheckableButton'
import LocationMap from 'components/LocationMap'
import Youtuber from 'components/Youtuber'

import Rellax from 'rellax'

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
      duration_range: [2, 120],
      min: 0,
      max: 120,
      slider: 40,
      range: [20, 35]
    }
  },
  mounted: function() {
    var rellax = new Rellax('.rellax');
  },
  methods: {
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
  position: absolute; width: 100%; left: 0;
}
</style>
