<template>
        <div>
            <h3>{{ title }}</h3>
            <div v-show="type !== 'controversiality'" class="chart-switch row">
                <div class="col align-items-center switch-wrapper">
                        <p>Cumulative</p>
                        <label class="switch">
                            <input checked type="checkbox" @click="displayCumulativeGraph(type)">
                            <div class="slider round"></div>
                        </label>
                </div>
                <div class="col align-items-center switch-wrapper">
                        <p>Smooth</p>
                        <label class="switch">
                            <input checked type="checkbox" @click="displaySmoothGraph(type)">
                            <div class="slider round"></div>
                        </label>
                </div>
            </div>
            <chart :id="id" :days="days" :allDays="allDays" :cumulative="cumulativeSwitches[type]" :smooth="smoothSwitches[type]"></chart>
        </div>
</template>

<script>
import Chart from 'components/Chart'

export default {
  name: 'graph-section',
  props: ['id', 'title', 'type', 'days', 'allDays'],
  components: {
      Chart
  },
  data() {
      return {
          cumulativeSwitches: {
              "commentActivity": true,
              "commentKarma": true,
              "submittedActivity": true,
              "submittedKarma": true,
              "controversiality": false
          },
          smoothSwitches: {
              "commentActivity": true,
              "submittedActivity": true,
              "commentKarma": true,
              "submittedKarma": true,
              "controversiality": false
          }
      }
  },
  methods: {
      displayCumulativeGraph(type) {
          this.cumulativeSwitches[type] = !this.cumulativeSwitches[type];
      },
      displaySmoothGraph(type) {
          this.smoothSwitches[type] = !this.smoothSwitches[type];
      }
  }
}
</script>

<style lang="scss">

label {
    margin-bottom: 0;
}

canvas {
    margin-bottom: 1rem;
}

.switch {
  position: relative;
  display: block;
  width: 60px;
  height: 34px;
  margin: auto;
}

.chart-switch {
    margin-bottom: 1rem;
    .col {
        justify-content: center;
    }
    p {
        margin-bottom: 0.25rem;
        margin-right: 0;
        margin-left: 0;
    }
}

/* Hide default HTML checkbox */
.switch input {display:none;}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255,255,255,0.2);
  height: 31px;
  transition: .25s;

  &::before {
      position: absolute;
      content: "";
      height: 21px;
      width: 21px;
      left: 6px;
      bottom: 5px;
      background-color: rgba(255,255,255,0.7);
      transition: .25s;
  }
}

input:checked + .slider {
    background: linear-gradient(135deg, #00bec7, #0073e8);

  &::before {
      background-color: white;
  }
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196F3;
}

input:checked + .slider:before {
  transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;

  &::before {
      border-radius: 50%;
  }
}

@media (min-width: 992px) {
    .chart-switch {
        p {
            margin-bottom: 0;
            margin-right: 1rem;
            margin-left: 1rem;
        }
    }
    .switch-wrapper {
        display: flex;
    }
    .switch {
        display: inline-block;
        margin: 0;
    }
}
</style>
