<!-- 情感分析 -->
<style lang="stylus" scoped>
.emotion
  height 800px
  background url('../../assets/bg.jpg') no-repeat
  background-size 100% 100%
  .board
    width 60%
    height calc(100% - 100px)
    margin-top -15px
    float left
  .keywords
    width 40%  
    height calc(100% - 100px)
    float left
    color white
    line-height 2em
    display table
    .words
        display table-cell
        vertical-align middle
button 
    width 60px
    height 30px
    border none
    border-radius 5px
    font-size 15px
    color #fff
    line-height 30px
    text-align center
    margin 10px 5px

    transition all 0.4s

.positive>button
    background-color #7db546
.negative>button
    background-color #d98522
button:hover
    background-color #cccccc
    color #000
</style>

<template>
<div class="emotion">
  <v-header :name="name" :legendArr="legendArr" :myChart="myChart"></v-header>
  <div class="board"></div>
  <div class="keywords">
      <div class="words">
        <div class="positive">
            正面高频词：
            <br>
            <button v-for="item in positiveWords" :title="'词频：'+item.value">{{item.name}}</button>
        </div>
        <div class="negative">
            负面高频词：
            <br>
            <button v-for="item in negativeWords" :title="'词频：'+item.value">{{item.name}}</button>
        </div>
      </div>
  </div>
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
      name: '情感分析',
      positiveWords:[],
      negativeWords:[]
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
    drawboard() {
      axios.get('static/data/emotion/data.json').then((res) => {
        this.positiveWords = res.data.keywords.positive;
        this.negativeWords = res.data.keywords.negative;
        // console.log(this.positiveWords)
        this.myChart = echarts.init(document.querySelector('.emotion .board'));
        this.myChart.setOption({
                title: {
                //show:false,
                x: "center",
                bottom: 20,
                text:'情感值: '+res.data.score,
                textStyle: {
                    color: 'white',
                    fontSize: 35 
                }
            },
            tooltip: {
                show: true,
                 formatter: "{a} <br/>{b} {c}",
                backgroundColor: '#F7F9FB',
                borderColor: '#92DAFF',
                borderWidth: '1px',
                textStyle: {
                    color: 'black'
                },
                formatter: function(param) {
                    return '<em style="color:' + param.color + ';">' + param.value + '</em> 分'
                }

            },
            series: [{
                name: '情感值',
                type: 'gauge',
                // startAngle: 180,
                // endAngle: 0,
                min: -1000,
                max: 1000,
                axisLine: {
                    show: true,
                    lineStyle: {
                        width: 40,
                        shadowBlur: 0,
                        color: [
                            [0.2, '#ee5828'],
                            [0.4, '#E98E2C'],
                            [0.6, '#DDBD4D'],
                            [0.8, '#7CBB55'],
                            [1, '#9CD6CE']
                        ]
                    }
                },
                axisTick: {
                    show: true,
                    splitNumber: 1
                },
                splitLine: {
                    show: true,
                    length: 40,
                    lineStyle: {
                        //color:'black'
                    },
                },
                axisLabel: {
                    formatter: function(e) {
                        switch (e + "") {
                            case "-800":
                                return "负能量";
                                //return "";
                            case "-600":
                                return "-600";

                            case "-400":
                                return "消极";
                                //return "";
                            case "-200":
                                return "-200";

                            case "0":
                                return "中性";
                                //return "";
                            case "200":
                                return "200";

                            case "400":
                                return "积极";
                                //return "";
                            case "600":
                                return "600";

                            case "800":
                                return "正能量";
                                //return "";
                            default:
                                return e;
                        }
                    },
                    textStyle: {
                        fontSize: 20,
                        fontWeight: ""
                    }
                },
                pointer: {
                    show: true,
                },
                detail: {
                    //show:false,
                    formatter: function(param) {
                        var level = '';
                        if (param < -600) {
                            level = '负能量'
                        } else if (param < -200) {
                            level = '消极'
                        } else if (param < 200) {
                            level = '中性'
                        } else if (param < 600) {
                            level = '积极'
                        } else if (param <= 1000) {
                            level = '正能量'
                        } else {
                            level = '暂无';
                        }
                        return level;
                    },
                    offsetCenter: [0, 140],
                    textStyle: {
                        fontSize: 40
                    }
                },
                data: [{
                    name: "",
                    value: res.data.score
                }]
            }]
        })
          
      })
    }
    
  },
  components: {
    'v-header': header
  },
  mounted() {
    this.$nextTick(function() {
        this.drawboard();
        this._init();
        var that = this;
        var resizeTimer = null;
        window.onresize = function() {
          if (resizeTimer) clearTimeout(resizeTimer);
          resizeTimer = setTimeout(function() {
            that.drawboard();
          }, 100);
        }
      });
  }
}

</script>
