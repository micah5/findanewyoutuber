<template>
<div>
    <div class="center">
        <img class="section-illustration" src="../assets/kindness.png">
    </div>
    <h3>Kindness Meter</h3>
    <p>Calculated through controversy and text analysis</p>
    <div class="progress">
      <div class="progress-bar" role="progressbar" :style="style" :aria-valuenow="value" aria-valuemin="0" aria-valuemax="100">
          {{value}}%
      </div>
    </div>
</div>
</template>

<script>
export default {
    name: 'kindness-meter',
    props: ['value'],
    computed: {
        style() {
            return `width: ${this.value}%`;
        }
    }
}
</script>

<style lang="scss">
.progress {
    line-height: 2rem;
    font-size: 1rem;
    background: rgba(0,0,0,0.5);
    margin: 0 auto;
    width: 500px;
    max-width: 100%;
    border: 1px solid black;
}
.progress-bar {
    background: linear-gradient(115deg, #ff79aa, #b743ff);
    height: 2rem;
}
</style>
