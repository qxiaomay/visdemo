<!-- 层叠柱状图 -->
<style lang="stylus" scoped>
.line
  height 100%
  background url('../../assets/bg.jpg') no-repeat
  background-size 100% 100%
  .main
    width 100%
    height calc(100% - 100px)
    margin-top -15px
</style>

<template>
<div class="line">
  <v-header :name="name" :legendArr="legendArr" :myChart="myChart"></v-header>
  <div class="main"></div>
</div>

</template>

<script>
import echarts from 'echarts'
import axios from 'axios'
import header from 'components/header/header'

export default {
  data() {
    return {
      legendArr: [],
      color: this.$store.state.color,
      myChart: {},
      name: '时间趋势图'
    }
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
    },
    jsonToArray (json, key) {
      var data = [];
        for(var i in json){
          if (key == 'time') {
            data.push(json[i].time);
          } else if(key == 'num') {
            data.push(json[i].num*8);
          }
        }
        return data;
    },
    drawLine() {
      axios.get('static/data/line/data.json').then((res) => {
        this.myChart = echarts.init(document.querySelector('.line .main'));
        this.myChart.setOption({
          tooltip: {
            trigger: 'axis'
          },
          xAxis: {
            axisLine: {
              lineStyle: {
                color: 'rgba(235, 235, 235, 0.69)'
              }
            },
            axisLabel: {
              textStyle: {
                color: 'white'
              },
              formatter: '{value} 时'
            },
            data: this.jsonToArray(res.data.timeLine, 'time') 
          },
          yAxis: {
            name: '数量',
            type: 'value',
            nameTextStyle: {
              color: 'rgba(255, 255, 255, 0.69)'
            },
            splitLine: {
              lineStyle: {
                color: ['rgba(230, 230, 230, 0.2)']
              }
            },
            axisLine: {
              lineStyle: {
                color: 'rgba(235, 235, 235, 0.69)'
              }
            },
            axisLabel: {
              textStyle: {
                color: 'white',
                fontSize: 14
              }
            }
          },
          dataZoom: [{
            startValue: '00：00'
          }, {
            type: 'inside'
          }],
          visualMap: {
            top: 10,
            right: 10,
            textStyle: {
                color: '#fff'
            },
            pieces: [{
              gt: 0,
              lte: 1000,
              color: '#096'
            }, {
              gt: 1000,
              lte: 2000,
              color: '#ffde33'
            }, {
              gt: 2000,
              lte: 3000,
              color: '#ff9933'
            }, {
              gt: 3000,
              lte: 4000,
              color: '#cc0033'
            }, {
              gt: 4000,
              lte: 6000,
              color: '#ed00ff'
            }, {
              gt: 6000,
              color: '#7e0023'
            }],
            outOfRange: {
              color: '#999'
            }
          },
          series: [{
            name: '评论数量',
            type: 'line',
            symbol: 'circle',
            symbolSize: 8,
            data: this.jsonToArray(res.data.timeLine, 'num'),
            markLine: {
              silent: true,
              data: [{
                yAxis: 1000
              }, {
                yAxis: 2000
              }, {
                yAxis: 3000
              }, {
                yAxis: 4000
              }, {
                yAxis: 6000
              }]
            }
          }]
        });
      })
    }
    
  },
  components: {
    'v-header': header
  },
  mounted() {
    this.$nextTick(function() {
        this.drawLine();
        this._init();
        var that = this;
        var resizeTimer = null;
        window.onresize = function() {
          if (resizeTimer) clearTimeout(resizeTimer);
          resizeTimer = setTimeout(function() {
            that.drawLine();
          }, 100);
        }
      });
  }
}

</script>
