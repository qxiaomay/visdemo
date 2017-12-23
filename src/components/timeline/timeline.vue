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
            data.push(json[i].num);
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
              lte: 100,
              color: '#096'
            }, {
              gt: 100,
              lte: 200,
              color: '#ffde33'
            }, {
              gt: 200,
              lte: 300,
              color: '#ff9933'
            }, {
              gt: 300,
              lte: 400,
              color: '#cc0033'
            }, {
              gt: 400,
              lte: 600,
              color: '#ed00ff'
            }, {
              gt: 600,
              color: '#7e0023'
            }],
            outOfRange: {
              color: '#999'
            }
          },
          series: [{
            name: '微博',
            type: 'line',
            symbol: 'circle',
            symbolSize: 8,
            data: this.jsonToArray(res.data.timeLine, 'num'),
            markLine: {
              silent: true,
              data: [{
                yAxis: 100
              }, {
                yAxis: 200
              }, {
                yAxis: 300
              }, {
                yAxis: 400
              }, {
                yAxis: 600
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
