import React, {Component} from 'react'
import {Card} from 'antd'
import ReactEcharts from 'echarts-for-react'

/*
后台管理的饼图路由组件
 */
export default class Pie extends Component {
  constructor(props) {
    super(props)
    this.state = {
        flag: true
      
    }
    this.echartsReact = React.createRef()
}
  getOption = () => {
    return {
      title : {
        text: '某站点用户访问来源',
        subtext: '纯属虚构',
        x:'center'
      },
      color: ['#0095ff', '#33e0e0', '#4bc772', '#fcd132', '#ffaaaf'],
      tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: ['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
      },
      series : [
        {
          name: '访问来源',
          type: 'pie',
          radius : '55%',
          center: ['50%', '60%'],
          data:[
            {value:335, name:'直接访问'},
            {value:310, name:'邮件营销'},
            {value:234, name:'联盟广告'},
            {value:135, name:'视频广告'},
            {value:1548, name:'搜索引擎'}
          ],
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };

  }

  getOption2 = () => {
    return {
      backgroundColor: '#2c343c',
      title: {
        text: '南丁格尔玫瑰图',
        left: 'center',
        top: 20,
        textStyle: {
          color: '#ccc'
        }
      },

      tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      
      visualMap: {
        show: false,
        min: 80,
        max: 600,
        inRange: {
          colorLightness: [0, 1]
        }
      },
      series : [
        {
          name:'访问来源',
          type:'pie',
          radius : [20, 90],
          center: ['50%', '50%'],
          data:[
            {value:335, name:'直接访问'},
            {value:310, name:'邮件营销'},
            {value:274, name:'联盟广告'},
            {value:235, name:'视频广告'},
            {value:400, name:'搜索引擎'}
          ].sort(function (a, b) { return a.value - b.value; }),
          roseType: 'radius',//长短变化
          label: {
            normal: {
              textStyle: {
                color: 'rgba(255, 255, 255, 0.3)'
              }
            }
          },
          labelLine: {
            normal: {
              lineStyle: {
                color: 'rgba(255, 255, 255, 0.3)'
              },
              smooth: 0.2,
              length: 10,
              length2: 20
            }
          },
          itemStyle: {
            normal: {
              color: '#c23531',
              shadowBlur: 200,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },

          animationType: 'scale',
          animationEasing: 'elasticOut',
          animationDelay: function (idx) {
            return Math.random() * 200;
          }
        }
      ]
    };
  }

  getOption3 () {
    return {
        color: ['#0095ff', '#33e0e0', '#4bc772', '#fcd132', '#ff607a'],
        title: {
          text: 'Customized Pie',
          left: 'center',
          // top: 20,
          textStyle: {
            color: '#ccc'
          }
        },
        tooltip: {
            trigger: 'item',
            formatter: '{b} : {c} ({d}%)'
        },
        
        legend: {
            orient: 'horizontal',
            bottom: 0,
            itemWidth: 15,
            itemHeight: 10
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '0',
            top: '3%',
            containLabel: true
        },
        // 圆中心的数字
        graphic: {
            elements: [
                {
                    type: 'text',
                    left: 'center',
                    top: '46%',
                    z: 2,
                    zlevel: 100,
                    style: {
                        text: '访客来源',
                        fill: '#1890ff',
                        width: 100,
                        height: 30,
                        font: 'bolder 20px Microsoft YaHei'
                    }
                    
                }
            ]
            
        },
        series: [
            {
                name: '',
                type: 'pie',
                radius: ['50%', '70%'], //使其中间是否为空白
                center: ['50%', '50%'], 
                legendHoverLink: false,
                data: [
                  {value:335, name:'直接访问'},
                  {value:310, name:'邮件营销'},
                  {value:274, name:'联盟广告'},
                  {value:235, name:'视频广告'},
                  {value:400, name:'搜索引擎'}
                ],
                itemStyle: {
                    emphasis: {
                        shadowBlur: 0,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                },
                
                label: {
                    normal: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        show: true,
                        textStyle: {
                            fontSize: '16',
                            fontWeight: 'bold'
                        }
                    }
                },
            }
        ]
    }
  }

 
  onChartover() {  
      // 当鼠标移到扇形图上数字清空
      this.echartsReact.props.option.graphic.elements[0].style.text = '';
      this.echartsReact.getEchartsInstance().setOption(this.echartsReact.props.option)
  
  }
  onChartout () {
        // 当鼠标移到扇形图上数字出现
      this.echartsReact.props.option.graphic.elements[0].style.text = '访客来源'
      this.echartsReact.getEchartsInstance().setOption(this.echartsReact.props.option) // 重新渲染
    
  }
  render() {
      const onEvents = {
        'mouseover': this.onChartover.bind(this),
        'mouseout': this.onChartout.bind(this)
    }
    return (
      <div>
        <Card title='饼图一'>
          <ReactEcharts option={this.getOption()} style={{height: 300}}/>
        </Card>
        <Card title='饼图二'>
          <ReactEcharts option={this.getOption2()} style={{height: 300}}/>
        </Card>
        <Card title='饼图三'>
          <ReactEcharts ref={(e) => { this.echartsReact = e }}
              option={this.getOption3()}   
              onEvents={onEvents}
              style={{width: '100%', height: '300px'}}
          />
        </Card>
      </div>
    )
  }
}
