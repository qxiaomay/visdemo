<template lang="html">
  <div class="dashboard">
    <div>
      <p>鹿晗关晓彤公开恋情事件微博数据可视化分析系统</p>
    </div>
    <div class="flex-container column">
        <div class="item one" @click="clickChart('1')" style="transform: translate(-22.4%,-37.5%) scale(0.25)">
          <themeRiver></themeRiver>
        </div>
        <div class="item two" @click="clickChart('2')" style="transform: translate(-22.4%,-12.5%) scale(0.25)">
          <emotion></emotion>
        </div>
        <div class="item three" @click="clickChart('3')" style="transform: translate(-22.4%,12.5%) scale(0.25)">
          <timeline></timeline>
        </div>
        <div class="item four" @click="clickChart('4')" style="transform: translate(-22.4%,37.5%) scale(0.25)">
          <fans></fans>
        </div>
        <div class="item five active" @click="clickChart('5')" style="transform: translate(43.7%, 0) scale(1)">
          <wordCloud></wordCloud>
        </div>
    </div>
  </div>
</template>

<script>
import fans from 'components/fans/fans'
import timeline from 'components/timeline/timeline'
import themeRiver from 'components/themeRiver/themeRiver'
import wordCloud from 'components/wordCloud/wordCloud'
import emotion from 'components/emotion/emotion'

export default {
  data() {
    return {
      items: []
    }
  },
  mounted() {
    this._init()
  },
  methods: {
    _resize() {
      this.$root.charts.forEach((myChart) => {
        myChart.resize()
      })
    },
    _init() {
      this.items = document.querySelectorAll('.flex-container .item')
      for (let i = 0; i < this.items.length; i++) {
        this.items[i].dataset.order = i + 1;
      }
    },
    clickChart(clickIndex) {
      let activeItem = document.querySelector('.flex-container .active')
      let activeIndex = activeItem.dataset.order
      let clickItem = this.items[clickIndex - 1]
      if (activeIndex === clickIndex) {
        return
      }
      activeItem.classList.remove('active')
      clickItem.classList.add('active')
      this._setStyle(clickItem, activeItem)
    },
    _setStyle(el1, el2) {
      let transform1 = el1.style.transform
      let transform2 = el2.style.transform
      el1.style.transform = transform2
      el2.style.transform = transform1
    }
  },
  components: {
    fans,
    emotion,
    themeRiver,
    wordCloud,
    timeline
  }
}

</script>

<style lang="stylus" scoped>
*
  box-sizing: border-box;
.line,.wordCloud,.themeRiver,.emotion,.fansChart
  height 100%!important
  width 100%!important
  background none!important
p
  color white
  font-size 40px
  font-weight bold
  text-align center
  padding-bottom 1.5%
.item
    padding: 0px;
    margin-left: -5%;
    width: 70%;
    height: 100%;
    position absolute
    transform scale(0.25)
    text-align: center;
    transition:all 0.8s;
    background rgba(32, 32, 35, 0.6)
.dashboard
    position relative
    width 100%
    height 100%
    margin:0px;
    padding:0px;
    padding-top 2%
    background url('../../assets/bg1.jpg');
    background-size 100% 100%
.flex-container.column
    position relative
    height: 90%;
    width: 90%;
    overflow: hidden;
    margin:  0 auto 100px auto;
    box-sizing: content-box;
.active
    height 100%
    width: 70%;
    margin-left: -65px;
</style>
