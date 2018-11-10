<template>
  <div style="position: relative;" class="pt-5">
    <h3 class="black--text" v-bind:id="'match-text-' + _uid">{{Math.round(percentage * 100)}}<small>%</small> match</h3>
    <v-card
      class="mx-auto hide-overflow"
      style="max-width: 1000px;"
    >
      <div class="container">
        <iframe width="100%" height="315" :id="'myFrame' + _uid" allow="autoplay"
          :src="`https://www.youtube.com/embed/${data.video_id}?showinfo=0&modestbranding=1`" frameborder="0">
        </iframe>
        <div class="overlay" @click="videoStarted" ref="videoOverlay"></div>
      </div>
      <v-slide-y-transition>
        <div v-if="video_clicked">
          <h3 class="mb-0">rate this channel</h3>
          <p class="black--text mb-0">your score will directly impact the search rankings</p>
          <v-layout row justify-center class="mt-5" style="width: 80%; margin-left: 10%;">
            <p class="mr-3 black--text">overall<br>score</p>
            <v-slider
              v-model="overall_user_rating"
              color="red"
              thumb-color="red"
              thumb-label="always"
            ></v-slider>
            <h1 class="ml-3 red--text">{{overall_user_rating}}<small>%</small></h1>
          </v-layout>
          <p class="grey--text" v-html="ratingDescription"></p>
          <v-layout row justify-center :style="$vuetify.breakpoint.xs ? 'width: 100%;' : 'width: 80%; margin-left: 10%;'">
            <!--<span class="black--text text--lighten-2 caption mt-1">quality</span>-->
            <v-layout v-if="$vuetify.breakpoint.smAndUp" row justify-center v-for="(criteria, key, index) in user_rating">
              <span class="black--text text--lighten-2 caption mt-1">
                {{criteria.name}}
              </span>
              <v-rating
                v-model="criteria.score"
                background-color="black"
                color="yellow accent-4"
                dense
                half-increments
                hover
                size="18"
              ></v-rating>
            </v-layout>
            <v-layout v-if="$vuetify.breakpoint.xs" column justify-center v-for="(criteria, key, index) in user_rating">
              <span class="black--text text--lighten-2 caption mt-1">
                {{criteria.name}}
              </span>
              <v-rating
                v-model="criteria.score"
                background-color="black"
                color="yellow accent-4"
                dense
                half-increments
                hover
                size="18"
              ></v-rating>
            </v-layout>
          </v-layout>
          <v-btn color="#77F8EA" class="mt-3 mb-0" @click="submit">add rating</v-btn>
          <v-divider></v-divider>
        </div>
      </v-slide-y-transition>
      <v-card-title>
        <div style="text-align: left;">
          <span class="headline">{{data.name}}</span><span>
          <v-btn dark color="orange" small class="mt-0 mb-3" style="border-width: 0px; height: 25px;" @click="openReddit()">
            <i class="fab fa-reddit-alien"></i> &nbsp; u/{{data.reddit_username}}
          </v-btn></span><span>
          <v-btn dark color="red" small class="mt-0 ml-0 mb-3" style="border-width: 0px; height: 25px;" @click="openYoutube()">
            <i class="fab fa-youtube"></i> &nbsp; {{data.name}}
          </v-btn></span>
          <!--<div class="g-ytsubscribe" data-channelid="UCmCPgOrC1GAtRL3YJSm1JGQ" data-layout="default" data-theme="dark" data-count="default"></div>-->
          <!--<div class="g-ytsubscribe" :data-channel="data.id" data-layout="default" data-count="default"></div>-->
          <div v-if="Array.isArray(data.demographics) == true">
            <div class="black--text font-weight-light" v-for="demographic in data.demographics">
              <v-icon color="black" left small>accessibility_new</v-icon>
              est age: <span class="grey--text">{{demographic.age}}</span>,
              <v-icon color="black" left small>face</v-icon>
              est gender: <span class="blue--text">{{({ 'M': 'male', 'F': 'female', } )[ demographic.gender ] || 'unknown'}}</span>
            </div>
          </div>
          <div v-else class="black--text font-weight-light">
            <v-icon color="black" left small>accessibility_new</v-icon>
            est age: <span class="grey--text">{{data.demographics.age}}</span>,
            <v-icon color="black" left small>face</v-icon>
            est gender: <span class="blue--text">{{({ 'M': 'male', 'F': 'female', } )[ data.demographics.gender ] || 'unknown'}}</span>
          </div>
          <div class="black--text font-weight-light">
            est <v-icon color="black" left small>fas fa-heart</v-icon> relationship: <span class="grey--text">{{data.relationship_perc > 0.75 ? 'couple' : 'single'}}</span>
            <v-icon color="black" left small>fas fa-child</v-icon> kids: <span class="grey--text">{{data.kids_perc > 0.75 ? 'likely' : 'unlikely'}}</span>
            <span v-if="data.country">
              <v-icon color="black" left small>fas fa-map-marker</v-icon> <span class="grey--text">{{data.country}}</span>
            </span>
          </div>
          <div class="black--text font-weight-light" v-if="data.locations.length > 0">
            <span class="grey--text"><v-icon color="black" left small>fas fa-plane</v-icon>
              <span v-if="data.locations.length > 1" v-for="location in data.locations.slice(0, data.locations.length - 1)">
                {{location}},
              </span>
              {{data.locations[data.locations.length - 1]}}
            </span>
          </div>
        </div>
        <v-spacer></v-spacer>
        <v-layout column text-xs-right v-if="data.avg_user_rating" :style="$vuetify.breakpoint.smAndUp ? 'max-width: 27%;' : 'width: 100%'">
          <h1><small>user score&nbsp;</small>{{Math.round(data.avg_user_rating.overall)}}<small>%</small></h1>
          <v-layout row>
            <span class="black--text text--lighten-2 caption mt-1">
              videography
            </span>
            <v-rating style="position: absolute; right: 0;"
              v-model="data.avg_user_rating.videography"
              background-color="grey"
              color="yellow accent-4"
              dense
              readonly
              half-increments
              hover
              size="18"
            ></v-rating>
          </v-layout>
          <v-layout row>
            <span class="black--text text--lighten-2 caption mt-1">
              personality
            </span>
            <v-rating style="position: absolute; right: 0;"
              v-model="data.avg_user_rating.personality"
              background-color="grey"
              color="yellow accent-4"
              dense
              readonly
              half-increments
              hover
              size="18"
            ></v-rating>
          </v-layout>
          <v-layout row>
            <span class="black--text text--lighten-2 caption mt-1">
              storytelling/ content
            </span>
            <v-rating style="position: absolute; right: 0;"
              v-model="data.avg_user_rating.storytelling"
              background-color="grey"
              color="yellow accent-4"
              dense
              readonly
              half-increments
              hover
              size="18"
            ></v-rating>
          </v-layout>
        </v-layout>
      </v-card-title>
      <div class="grey--text font-weight-light ml-3 mr-3 mb-2" style="text-align: left;">
        {{description}}<span @click="show_all_description = !show_all_description">&nbsp;<u>{{show_all_description ? 'less' : 'more'}}</u></span></div>
      <v-divider></v-divider>
      <v-layout row wrap class="mb-3">
        <v-flex xs12 md6 v-if="data.found_phrases && data.found_phrases.length > 0">
          <v-layout column>
            <h3 class="mb-0">usually starts their videos with</h3>
            <p v-for="phrase in data.found_phrases" class="black--text mb-0">"{{phrase}}..."</p>
          </v-layout>
        </v-flex>
        <v-flex xs12 md6 pr-3 pl-3>
          <v-layout column>
            <h3 class="mb-0">video type/style</h3>
            <p class="grey--text mb-0">
              <span style="color: #68D35B"><b>{{Math.round(percSumTopical)}}<small>%</small></b> topical</span>
              vs
              <span style="color: #EE8140"><b>{{Math.round(100 - percSumTopical)}}<small>%</small></b> vlog</span>
            </p>
            <v-progress-linear
              background-color="#EE8140"
              color="#68D35B"
              :value="percSumTopical"
            ></v-progress-linear>
          </v-layout>
        </v-flex>
      </v-layout>
      <v-layout row wrap class="mb-3">
        <v-flex xs12 md6>
          <kindness-meter :value="data.avg_sentiment_pred"></kindness-meter>
        </v-flex>
        <v-flex xs12 md6 pr-3 :style="{'max-width: 100%;': $vuetify.breakpoint.smAndDown, 'max-width: 50%;': $vuetify.breakpoint.smAndUp}">
          <p class="mb-0 black--text">most positive videos ☀️</p>
          <v-btn
            style="max-width: 95%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"
            color="#FAE16B"
            v-for="video in mostPositiveVideos.slice(0, 3)"
            @click="data.video_id = video.video_id"
            v-scroll-to="'#match-text-' + _uid">
            {{video.title}} ~ {{Math.round(video.pred[0] * 100)}}<small>% positive</small>
          </v-btn>
          <p class="mt-3 mb-0 black--text">most critical videos ⛈</p>
          <v-btn
            style="max-width: 95%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"
            color="#B4DAEF"
            v-for="video in mostPositiveVideos.slice().reverse().slice(0, 3)"
            @click="data.video_id = video.video_id"
            v-scroll-to="'#match-text-' + _uid">
            {{video.title}} ~ {{Math.round(100 - (video.pred[0] * 100))}}<small>% negative</small>
          </v-btn>
        </v-flex>
      </v-layout>
      <v-layout column v-if="most_occur.length > 0">
        <most-common-words :words="most_occur"></most-common-words>
      </v-layout>
    </v-card>
    <v-img class="hover-img" :src="'https://findanewvlogger.herokuapp.com/data/' + data.thumbnail">
    </v-img>
  </div>
</template>

<script>
import KindnessMeter from 'components/KindnessMeter'
import MostCommonWords from 'components/MostCommonWords'
import _ from 'lodash'
import $ from 'jquery'
export default {
    name: 'youtuber',
    props: ['data', 'percentage'],
    components: {
      KindnessMeter,
      MostCommonWords
    },
    data () {
      return {
        copied: false,
        dialog: false,
        rating: 3.5,
        show_all: false,
        show_all_description: false,
        video_clicked: false,
        overall_user_rating: 50,
        user_rating: [
          {
            name: 'videography',
            score: 2.5
          },
          {
            name: 'personality',
            score: 2.5
          },
          {
            name: 'storytelling/ content',
            score: 2.5
          }
        ]
      }
    },
    mounted: function() {
      /*document.getElementById("myFrame " + this._uid).contentDocument.addEventListener(function () {
        console.log("clicked")
      });*/
      /*var vm = this
      var monitor = setInterval(function() {
        var elem = document.activeElement;
        if (elem.id == 'iframe') {
          vm.video_clicked = true
          clearInterval(monitor);
        }
      }, 100);*/
      /*document.getElementById("iframe")
      .contentWindow.document.body
      .onclick = function() {
          alert("iframe clicked");
      }*/
    },
    methods: {
      submit: function() {
        var data = {
        	"id": this.data.id,
        	"overall": (this.overall_user_rating / 100),
        	"videography": (this.user_rating[0].score / 5),
        	"storytelling": (this.user_rating[1].score / 5),
        	"personality": (this.user_rating[2].score / 5)
        }
        console.log(JSON.stringify(data))
        var settings = {
          "async": true,
          "crossDomain": true,
          "url": "https://findanewvlogger.herokuapp.com/update_score",
          "method": "POST",
          "headers": {
            "Content-Type": "application/json",
            "cache-control": "no-cache",
            "Postman-Token": "c0b967ef-9bee-42cd-aa75-a3d37174583b"
          },
          "processData": false,
          "data": JSON.stringify(data)
        }

        var vm = this
        vm.video_clicked = false
        $.ajax(settings).done(function (response) {
          if (response.success == false) {
            console.log('already done')
          } else {
            vm.data.avg_user_rating = response;
            console.log('here ', JSON.stringify(vm.data.avg_user_rating))
            vm.$forceUpdate()
          }
        });
      },
      openReddit: function() {
        window.open('http://www.reddit.com/u/' + this.data.reddit_username)
      },
      openYoutube: function() {
        window.open('http://www.youtube.com/channel/' + this.data.id)
      },
      copy () {
        const markup = this.$refs.link
        markup.focus()
        document.execCommand('selectAll', false, null)
        this.copied = document.execCommand('copy')
      },
      videoStarted: function() {
        console.log('clicked')
        this.video_clicked = true
        this.$refs.videoOverlay.outerHTML = ""
        var id = '#myFrame' + this._uid
        console.log('id', id)
        var videoURL = $(id).prop('src');
        videoURL += "&autoplay=1";
        $(id).prop('src', videoURL);
      }
    },
    computed: {
      description: function() {
        if (this.show_all_description) {
          return this.data.description
        } else {
          return this.data.description.substring(0, 100) + '...';
        }
      },
      mostPositiveVideos: function() {
        return _.orderBy(this.data.sentiment_pred, ['pred[0]'], ['desc']);
        /*for (let video of this.data.sentiment_pred) {

        }*/
      },
      percSumTopical: function() {
        return (this.data.sum_topical/(this.data.sum_topical + this.data.sum_vlog)) * 100
      },
      cute_gender_name: function() {
        return (this.data.demographics.length > 0 ? (({ 'M': 'guy', 'F': 'girl', } )[ this.data.demographics[0].gender ] || 'guy') : 'guy')
      },
      most_occur: function() {
        const x = this.data.title_corpus.replace(/[^A-Za-z0-9 ]/g, '').split(" ");
        const k = {};
           x.forEach(v => {
             if(k[v]) {
                k[v] +=1;
             } else {
                k[v] = 1;
             }
           });
        const y = Object.keys(k).map(key => ({'name': key, 'frequency': k[key]}));
        var filtered = y.filter(function( obj ) {
            return obj.frequency !== 1;
        });
        function compare(a, b) {
            a = a['frequency'];
            b = b['frequency'];
            var type = (typeof(a) === 'string' ||
                        typeof(b) === 'string') ? 'string' : 'number';
            var result;
            if (type === 'string') result = a.localeCompare(b);
            else result = a - b;
            return result;
        }
        var sorted = filtered.sort(compare);
        return sorted.slice().reverse()
      },
      ratingDescription: function() {
        if (this.overall_user_rating < 10) {
          return 'wow, really? this channel must be <i>awful</i>. there\'s nothing even remotely interesting here, huh?'
        } else if (this.overall_user_rating < 20) {
          return 'not good'
        } else if (this.overall_user_rating < 40) {
          return 'below average, not on par with the quality i\'d expect'
        } else if (this.overall_user_rating < 50) {
          return 'maybe there\'s something of value here, but it\'s not for me'
        } else if (this.overall_user_rating < 60) {
          return 'decent, moderately interesting'
        } else if (this.overall_user_rating < 80) {
          return 'very enjoyable. good stuff my ' + this.cute_gender_name
        } else if (this.overall_user_rating < 90) {
          return 'wow. this is <i>seriously</i> good. on par with most of the major youtubers'
        } else if (this.overall_user_rating < 100) {
          return 'complete hidden gem. underrated'
        } else {
          return 'really? <i>really?</i> you\'re not even trying to be nuanced with the score, huh'
        }
      }
    }
}
</script>

<style scoped>
#container {
  margin: 20px;
  width: 200px;
  height: 200px;
}
.v-card {
  border-style: solid;
  border-color: black;
  border-width: 4px;
  box-shadow: 10px 10px !important;
  text-transform: lowercase !important;
}
.hover-img {
  margin-left: 30px;
  margin-top: 70px;
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
@media only screen and (max-width: 1250px) {
  .hover-img {
    margin-left: 0px;
  }
}
.container{position:relative;float:left;padding: 0;}
.overlay{top:0;left:0;width:100%;height:100%;position:absolute;}
</style>
