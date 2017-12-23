<!-- wordCloud -->
<style lang="stylus" scoped>
.wordCloud
  height 800px
  background url('../../assets/bg.jpg') no-repeat
  background-size 100% 100%
  color white
  .main
    width 100%
    height calc(100% - 100px)
    margin-top -15px
</style>

<template>
<div class="wordCloud">
  <v-header :name="name" :legendArr="legendArr" :myChart="myChart"></v-header>
  <div class="main"></div>
</div>

</template>

<script>
import echarts from 'echarts'
import 'echarts-wordcloud'
import axios from 'axios'
import header from 'components/header/header'

export default {
  data() {
    return {
      legendArr: [],
      color: this.$store.state.color,
      myChart: {},
      name: '关键词词云'
    }
  },
  components: {
    'v-header': header
  },
  methods: {
    _init() {
      // this.legendArr = this.myChart.getOption().series
      // this.legendArr.forEach((data) => {
      //   data.selected = true;
      // })
      this.$root.charts.push(this.myChart)
      window.addEventListener('resize', function() {
        this.myChart.resize()
      }.bind(this))
    }
  },
  mounted() {
        axios.get('static/data/wordCloud/word.json').then((res) => {
            var keywords = res.data;
            
            this.myChart = echarts.init(document.querySelector('.wordCloud .main'));
            var data = [];
            for (var name in keywords) {
                data.push({
                    name: name,
                    value: Math.sqrt(keywords[name])
                })
            }
            var maskImage = new Image();
            var option = {
                tooltip: {},
                series: [ {
                    type: 'wordCloud',
                    top: -20,
                    sizeRange: [10, 100],
                    rotationRange: [-90, 90],
                    rotationStep: 45,
                    gridSize: 2,
                    shape: 'pentagon',
                    width: '80%',
                    height: '120%',
                    maskImage: maskImage,
                    drawOutOfBound: false,
                    textStyle: {
                        normal: {
                            color: function () {
                                return 'rgb(' + [
                                    Math.round((Math.random()+1) * 125),
                                    Math.round((Math.random()+1) * 125),
                                    Math.round(Math.random() * 255)
                                ].join(',') + ')';
                            }
                        },
                        emphasis: {
                            color: 'red',
                            shadowBlur: 5,
                            shadowColor: '#ddd'
                        }
                    },
                    data: data.sort(function (a, b) {
                        return b.value  - a.value;
                    })
                } ]
            };
            maskImage.onload =  () => {
                option.series[0].maskImage
                this.myChart.setOption(option);
            }
            maskImage.src = './../../../static/img/break2.png';
            window.onresize =  () => {
                this.myChart.resize();
            }
        })

        this._init();
  }
}
            

</script>

