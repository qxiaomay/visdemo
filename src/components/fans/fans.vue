<!-- 柱状图 -->
<style lang="stylus" scoped>
.fansChart
  height 800px
  background url('../../assets/bg.jpg') no-repeat
  background-size 100% 100%
  color white
  .main
    width 100%
    height calc(100% - 50px)
    margin-top -15px
.map 
  width 100%
  height calc(100% - 100px)

.age,.client 
  margin 0 auto
</style>

<template>
<div class="fansChart">
  <v-header :name="name" :legendArr="legendArr" :myChart="myChart"></v-header>
  <div class="main">
    <table border="0" style="width:100%;height:85%">
      <tr>
        <td style="width:60%!important">
          <div class="map" style="height:100%;"></div>
        </td>
        <td style="width:40%!important;">
          <div class="cont" style=""> 
            <div class="client"></div>
            <div class="age"></div>
          </div>
        </td>
      </tr>
    </table>
    
    <!-- <div class="other">
      <div class="cont">
        <div class="auth"></div>
        <div class="client"></div>
      </div>
    </div> -->
  </div>
</div>

</template>

<script>
import echarts from 'echarts'
import axios from 'axios'
import china from 'echarts/map/js/china'
import header from 'components/header/header'

export default {
  data() {
    return {
      legendArr: [],
      color: this.$store.state.color,
      myChart: {},
      name: '用户群体画像',
      mapChart: {},
      authPie: {},
      clientPie: {},
      ageBar:{}
    }
  },
  methods: {
    _init() {
      // this.$root.charts.push(this.myChart)
      window.addEventListener('resize', function() {
        this.mapChart.resize();
        this.ageBar.resize();
        this.clientPie.resize();
      }.bind(this))
    },
    jsonToArray (json, key) {
      var data = [];
        for(var i in json){
          if (key == 'value') {
            data.push(json[i].value);
          } else if(key == 'name') {
            data.push(json[i].name);
          }
        }
        return data;
    },
    drawMap (data) {
        this.mapChart = echarts.init(document.querySelector('.map'));
        this.mapChart.setOption({
          title: {
            text: '用户地域分布',
            left: 'center',
            top:50,
            textStyle: {
              color: 'white',
              fontSize: 25
            }
          },
          tooltip : {
              trigger: 'item'
          },
          visualMap: {
              min: 0,
              max: 10,
              left: 'left',
              top: 'bottom',
              color: ['#ee5828', '#d59326', '#a8b168', '#94be85', '#7ccea9'],
              text:['高','低'],           // 文本，默认为数值文本
              textStyle: {
                color: 'white'
              },
              calculable : true
          },
          series : [
          {
              name: '用户数目',
              type: 'map',
              mapType: 'china',
              roam: false,
              label: {
                  normal: {
                      show: false
                  },
                  emphasis: {
                      show: true
                  }
              },
              data:data
          }]
        });
    },
    drawAuthPie (data) {
      var divAuth = document.querySelector('.auth');
      divAuth.style.height = (divAuth.offsetWidth * 0.75 )+"px";
      this.authPie = echarts.init(divAuth);
      this.authPie.setOption({
          title: {
            text: '用户认证信息',
            left: 'center',
            top:20,
            textStyle: {
              color: 'white',
              fontSize: 18
            }
          },
          tooltip: {
              trigger: 'item',
              formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          series: [{
              name: '用户认证信息',
              type: 'pie',
              radius: '60%',
              center: ['50%', '50%'],
              clockwise: false,
              minAngle: 35,
              data: data,
              label: {
                normal: {
                  formatter: '{b}年：\n{d}%',
                    textStyle: {
                        color: 'white',
                        fontSize: 16,
                    }
                  }
              },
              labelLine: {
                  normal: {
                    lineStyle: {
                        color: 'rgba(255, 255, 255, 0.8)'
                    },
                    smooth: 0.2,
                    length: 15
                  }
              },
              itemStyle: {
                  normal: {
                      borderWidth: 4,
                      borderColor: '#ffffff'
                  },
                  emphasis: {
                      borderWidth: 0,
                      shadowBlur: 10,
                      shadowOffsetX: 0,
                      shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
              }
          }],
          color: [
              '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3','#2f4554'
          ]
      });
    },
    drawClientPie (clientData, sexData) {
      var divClient = document.querySelector('.client');
      divClient.style.height = (divClient.offsetWidth * 0.75 )+"px";
      this.clientPie = echarts.init(divClient);
      this.clientPie.setOption({
          title: {
            text: '客户端及男女比例',
            left: 'center',
            top:10,
            textStyle: {
              color: 'white',
              fontSize: 18
            }
          },
          tooltip: {
              trigger: 'item',
              formatter: "{a} <br/>{b}: {c} ({d}%)"
          },
          series: [
              {
                  name:'男女比例',
                  type:'pie',
                  radius: [0, '35%'],
                  center: ['50%', '50%'],
                  clockwise: false,
                  label: {
                      normal: {
                          position: 'inner'
                      }
                  },
                  labelLine: {
                      normal: {
                          show: false
                      }
                  },
                  data:sexData
              },
              {
                  name:'微博客户端',
                  type:'pie',
                  radius: ['45%', '60%'],
                  center: ['50%', '50%'],
                  clockwise: false,
                  minAngle: 30,
                  label: {
                      normal: {
                        formatter: "{b}: \n{d}%",
                        textStyle: {
                            color: 'white',
                            fontSize: 16,
                        }
                      }
                  },
                  itemStyle: {
                    normal: {
                      color: ''
                    }
                  },
                  data: clientData
              }
          ],
          // color: [
          //     '#255B78', '#4a9c96','#2e526f','#346276', '#418689',  '#54b3a5', '#60c2c7','#51D4EB','#6acfff'
          // ]
      });
    },
    drawAgeBar(data) {
      var divAuth = document.querySelector('.age');
      // divAuth.style.width = (divAuth.offsetWidth * 0.80 )+"px";
      divAuth.style.height = (divAuth.offsetWidth * 0.70 )+"px";
      divAuth.style.width = (divAuth.offsetWidth * 0.90 )+"px";
      this.authPie = echarts.init(divAuth);
      this.authPie.setOption({
        title: {
            text: '评论数量-年龄分布',
            left: 'center',
            top:20,
            textStyle: {
              color: 'white',
              fontSize: 18
            }
        },
        color: ['#3398DB'],
        tooltip : {
            trigger: 'axis',
            formatter: "{b}年 <br/>{a} : {c} ",
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '5%',
            containLabel: true
        },
        xAxis : [
            {
                type : 'category',
                data : this.jsonToArray(data, 'name'),
                axisTick: {
                    alignWithLabel: true
                },
                axisLine: {
                  lineStyle: {
                    color: 'rgba(235, 235, 235, 0.69)'
                  }
                },
                axisLabel: {
                  rotate: -30,
                  textStyle: {
                    color: 'white'
                  }
                }
            }
        ],
        yAxis : [
            {
                // type : 'category',
                // data : ['10','20','30','40'],
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
                axisTick: {
                    alignWithLabel: true
                }
            }
        ],
        series : [
            {
                name:'评论数量',
                type:'bar',
                barWidth: '40%',
                data:this.jsonToArray(data, 'value')
            },
            
        ],
        // label: {
        //         normal: {
        //             show: true,
        //             position: 'top',
        //             formatter: '{c}',
        //             color: 'white'
        //         }
        //     },
        itemStyle: {
                    normal: {

                      color: function(params) { 
                        　//首先定义一个数组 
                        var colorList = [ 
                        '#ee5828','#d16621', '#d59326', '#c18e23','#a8b168','#a1aa5b', '#94be85', '#90b97b','#7ccea9'
                        ]; 
                        return colorList[params.dataIndex] 
                        }, 
                    
                        // color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        //     offset: 0,
                        //     color: 'rgba(212,97,34, 1)'
                        // }, {
                        //     offset: 1,
                        //     color: 'rgba(134,197,149, 0.6)'
                        // }]),
                        shadowColor: 'rgba(255, 255, 255, 0.1)',
                        shadowBlur: 10
                    }
                }
      })
    }
  },
  components: {
    'v-header': header
  },
  mounted() {
    this.$nextTick(function() {
      axios.get('static/data/fans/data.json').then((res)=>{
        this.fansData = res.data;

        this.drawMap(res.data.geo);
        // this.drawAuthPie(res.data.age);
        this.drawClientPie(res.data.clientInfo, res.data.sex);
        this.drawAgeBar(res.data.age);
      })

      this._init();
    });
  }
}

</script>
