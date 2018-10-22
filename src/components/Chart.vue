<template>
        <div>
            <canvas :id="id" :ref="id" :width="size.width" :height="size.height"></canvas>
        </div>
</template>

<script>
import Chart from 'chart.js'

Chart.defaults.global.defaultFontColor = '#cad6e6';
Chart.defaults.global.defaultFontFamily = `Avenir,-apple-system,
                BlinkMacSystemFont,
                "Segoe UI",
                Roboto,
                Oxygen-Sans,
                Ubuntu,
                Cantarell,
                "Helvetica Neue",
                sans-serif`;

export default {
  name: 'chart',
  props: ['id', 'days', 'allDays', 'cumulative', 'smooth'],
  mounted() {
      this.drawChart();
      this.$watch('days', function () {
         this.drawChart();
      }, {deep:true});
      this.$watch('cumulative', function () {
         this.drawChart();
      }, {deep:true});
      this.$watch('smooth', function () {
         this.drawChart();
      }, {deep:true});
  },
  computed: {
      size() {
          if (this.id === 'controversiality-chart') {
              return {
                  width: 400,
                  height: 250
              }
          } else {
              return {
                  width: 400,
                  height: 350
              }
          }
      },
      chartProps() {
          var property, type, label, colorStop1, colorStop2, borderColor;
          switch (this.id) {
              case 'commentActivity-chart':
                  property = this.cumulative ? 'cumulativeNumComments' : 'numComments';
                  type = 'line';
                  label = '# of comments';
                  colorStop1 = 'rgba(200,150,255,0.8)';
                  colorStop2 = 'rgba(200,150,255,0)';
                  borderColor = '#c170ff';
                  break;
              case 'commentKarma-chart':
                  property = this.cumulative ? 'cumulativeCommentKarma' : 'commentKarma';
                  type = 'line';
                  label = 'Comment karma';
                  colorStop1 = 'rgba(100,255,200,0.8)';
                  colorStop2 = 'rgba(100,255,200,0)';
                  borderColor = '#00cb8f';
                  break;
              case 'submittedActivity-chart':
                  property = this.cumulative ? 'cumulativeNumSubmitted' : 'numSubmitted';
                  type = 'line';
                  label = '# of submissions';
                  colorStop1 = 'rgba(255,100,50,0.8)';
                  colorStop2 = 'rgba(255,100,50,0)';
                  borderColor = '#ff8244';
                  break;
              case 'submittedKarma-chart':
                  property = this.cumulative ? 'cumulativeSubmittedKarma' : 'submittedKarma';
                  type = 'line';
                  label = 'Submitted karma';
                  colorStop1 = 'rgba(0,200,255,0.8)';
                  colorStop2 = 'rgba(0,200,255,0)';
                  borderColor = '#54e5ff';
                  break;
              case 'controversiality-chart':
                  property = this.cumulative ? 'cumulativeControversy' : 'avgControversy';
                  type = 'bar';
                  label = 'Controversiality %';
                  colorStop1 = 'rgba(255,225,150,1)';
                  colorStop2 = 'rgba(255,225,150,0)';
                  borderColor = '#f4ea9a';
                  break;
          }
          return {
              property: property,
              type: type,
              label: label,
              colorStop1: colorStop1,
              colorStop2: colorStop2,
              borderColor: borderColor
          };
      }
  },
  methods: {
      drawChart() {
          if (this.days.length === 0 || this.allDays.length === 0) return;

          let days = this.smooth ? this.days : this.allDays;
          let vals = [];
          let labels = [];
          let props = this.chartProps;

          days.forEach(function(day){
              vals.push(day[props.property]);
              labels.push(day.day);
          });

          let ctx = this.$refs[this.id].getContext('2d');
          let gradient = ctx.createLinearGradient(0, 0, 0, 350);
          gradient.addColorStop(0, props.colorStop1);
          gradient.addColorStop(1, props.colorStop2);

          if (this.chart) this.chart.destroy();

          this.chart = new Chart(ctx, {
              type: props.type,
              data: {
                  labels: labels,
                  datasets: [{
                      label: props.label,
                      backgroundColor: gradient,
                      borderWidth: 1,
                      borderColor: props.borderColor,
                      data: vals
                  }]
              }
          });
      }
  }
}
</script>
