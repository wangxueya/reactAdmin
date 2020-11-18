import React, {Component} from 'react'
import {Card, Button} from 'antd'
import ReactEcharts from 'echarts-for-react'

/*
后台管理的柱状图路由组件
 */
export default class Bar extends Component {

  state = {
    sales: [5, 20, 36, 10, 10, 20], // 销量的数组
    stores: [6, 10, 25, 20, 15, 10], // 库存的数组
    advance_sale:[6, 22, 37, 18, 17, 26],//预售的数组
  }

  update = () => {
    this.setState(state => ({
      sales: state.sales.map(sale => sale + 1),
      stores: state.stores.reduce((pre, store) => {
        pre.push(store-1)
        return pre
      }, []),
      advance_sale: state.advance_sale.map(advance_sale => advance_sale + 1),
    }))
  }

  /*
  返回柱状图的配置对象
   */
  getOption = (sales, stores,advance_sale) => {
    return {
      title: {
        text: 'ECharts 示例展示'
      },
      tooltip: {},
      legend: {
        data:['销量', '库存','预售']
      },
      xAxis: {
        data: ["眼霜","洗面奶","沐浴露","水乳","面霜","精华"]
      },
      yAxis: {},
      series: [{
        name: '销量',
        type: 'bar',
        data: sales
      }, {
        name: '库存',
        type: 'bar',
        data: stores
      }, {
        name: '预售',
        type: 'bar',
        data: advance_sale
      }]
    }
  }

  render() {
    const {sales, stores,advance_sale} = this.state
    return (
      <div>
        <Card>
          <Button type='primary' onClick={this.update}>更新</Button>
        </Card>

        <Card title='柱状图一'>
          <ReactEcharts option={this.getOption(sales, stores,advance_sale)} />
        </Card>

      </div>
    )
  }
}