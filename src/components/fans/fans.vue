<!-- 柱状图 -->
<style lang="stylus" scoped>
.fansChart
  height 800px
  background url('../../assets/bg.jpg') no-repeat
  background-size 100% 100%
  color white
  .main
    width 100%
    height calc(100% - 100px)
    margin-top -15px
.map 
  width 100%
  height calc(100% - 100px)

.auth,.client 
  height 300px
</style>

<template>
<div class="fansChart">
  <v-header :name="name" :legendArr="legendArr" :myChart="myChart"></v-header>
  <div class="main">
    <table border="0" style="width:100%">
      <tr>
        <td style="width:60%!important">
          <div class="map" style="height:600px;"></div>
        </td>
        <td style="width:40%!important;">
          <div class="cont" style="">
            <div class="auth"></div>
            <div class="client"></div>
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
      clientPie: {}
    }
  },
  methods: {
    _init() {
      // this.$root.charts.push(this.myChart)
      window.addEventListener('resize', function() {
        this.mapChart.resize();
        this.authPie.resize();
        this.clientPie.resize();
      }.bind(this))
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
                  formatter: '{b}\n {d}%',
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
              '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074'
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
        this.drawAuthPie(res.data.authinfo);
        this.drawClientPie(res.data.clientInfo, res.data.sex);
      })

      this._init();
    });
  }
}

</script>
