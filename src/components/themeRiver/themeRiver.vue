<!-- themeriver -->
<style lang="stylus" scoped>
.themeRiver
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
<div class="themeRiver">
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
      name: '主题河流图'
    }
  },
  methods: {
    _init() {
    //   this.legendArr = this.myChart.getOption().series

    //   this.legendArr.forEach((data) => {
    //     data.selected = true;
    //   })
      this.$root.charts.push(this.myChart)
      window.addEventListener('resize', function() {
        this.myChart.resize()
      }.bind(this))
    },
    jsonToArray (json) {
        var data = [];
        for(var i in json){
            data.push([json[i].time,json[i].num,json[i].name]);
        }
        return data;
    }
  },
  components: {
    'v-header': header
  },
  mounted() {

    axios.get('static/data/themeRiver/theme.json').then((res) => {
        // 基于准备好的dom，初始化echarts实例
        this.myChart = echarts.init(document.querySelector('.themeRiver .main'));
        this.myChart.setOption({
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'line',
                    lineStyle: {
                        color: 'rgba(0,0,0,0.2)',
                        width: 1,
                        type: 'solid'
                    }
                }
            },

            legend: {
                top:20,
                data: ['鹿晗关晓彤恋情', '鹿晗迪丽热巴', '鹿晗回国三周年', '上海堡垒', '甜蜜暴击', '鹿晗关晓彤分手了吗','鹿饭一直在','关晓彤公布恋情首亮相','轩辕剑之汉之云'],
                textStyle: {
                    color: 'white'
                },
                selected: {
                        '鹿晗关晓彤恋情': true,
                        '鹿晗迪丽热巴': true,
                        '鹿晗回国三周年':true,
                        '上海堡垒':true,
                        '甜蜜暴击':true,
                        '鹿晗关晓彤分手了吗':true,
                        '鹿饭一直在':true,
                        '关晓彤公布恋情首亮相':true,
                        '关晓彤公布恋情首亮相':false,
                        '轩辕剑之汉之云':true
                    }
            },

            singleAxis: {
                top: 50,
                bottom: 50,
                axisTick: {},
                axisLabel: {
                    textStyle: {
                        color: 'white'
                    }
                },
                type: 'time',
                axisPointer: {
                    animation: true,
                    label: {
                        show: true
                    }
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        type: 'dashed',
                        opacity: 0.2
                    }
                }
            },

            series: [
            {
                type: 'themeRiver',
                itemStyle: {
                    emphasis: {
                        shadowBlur: 20,
                        shadowColor: 'rgba(0, 0, 0, 0.8)'
                    }
                },
                label: {
                    normal: {
                        show:false
                        // color: 'white',
                        // fontSize: 18,
                        // position: 'left',
                        // distance: 50
                    }
                },
                data: this.jsonToArray(res.data)
            }],
            color:['#2f4554', '#61a0a8', '#d48265', '#91c7ae','#c23531','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3']
        });
    })
    this._init()
    
  }
}
</script>