<template>
<div>
  <div id="container">
    <svg style="display: block;
    margin-left: auto;
    margin-right: auto;
    width: 50%;" xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" viewBox="0 0 100 100">
        <path fill-opacity="0" stroke-width="5" stroke="#000000" d="M81.495,13.923c-11.368-5.261-26.234-0.311-31.489,11.032C44.74,13.612,29.879,8.657,18.511,13.923  C6.402,19.539,0.613,33.883,10.175,50.804c6.792,12.04,18.826,21.111,39.831,37.379c20.993-16.268,33.033-25.344,39.819-37.379  C99.387,33.883,93.598,19.539,81.495,13.923z"/>
        <path v-bind:id="'heart-path-' + _uid" fill-opacity="0" stroke-width="8" stroke="#E85138" d="M81.495,13.923c-11.368-5.261-26.234-0.311-31.489,11.032C44.74,13.612,29.879,8.657,18.511,13.923  C6.402,19.539,0.613,33.883,10.175,50.804c6.792,12.04,18.826,21.111,39.831,37.379c20.993-16.268,33.033-25.344,39.819-37.379  C99.387,33.883,93.598,19.539,81.495,13.923z"/>
    </svg>
    <h3 class="mb-0">{{Math.round(value*100)}}<small>%</small> positive</h3>
    <p class="black--text mb-0">probably a <span v-html="niceness"></span> person</p>
    <p class="grey--text">Calculated through transcript sentiment analysis</p>
  </div>
</div>
</template>

<script>
import ProgressBar from 'progressbar.js'
export default {
    name: 'kindness-meter',
    props: ['value'],
    mounted: function() {
      var bar = new ProgressBar.Path('#heart-path-' + this._uid, {
        easing: 'easeInOut',
        duration: 1400
      });

      bar.set(0);
      bar.animate(this.value);
    },
    computed: {
      niceness: function() {
        if (this.value < 0.2) return '<i>very</i> critical'
        else if (this.value < 0.3) return 'critical'
        else if (this.value < 0.4) return '<i>kinda</i> harsh'
        else if (this.value < 0.5) return 'harsh but fair'
        else if (this.value < 0.6) return 'average kind of'
        else if (this.value < 0.7) return 'nice'
        else if (this.value < 0.8) return 'good'
        else if (this.value < 0.9) return 'kind'
        else if (this.value < 1) return '<i>really</i> nice'
      }
    }
}
</script>

<style>
#container {
  width: 100%;
}
</style>
