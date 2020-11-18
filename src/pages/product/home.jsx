import  React,{Component} from 'react'
import {Card,Select,Input,Button,Icon,Table,message} from 'antd'
import LinkButton from '../../components/link-button'
import {reqProducts,reqSearchProducts,reqUpdateStatus} from '../../api'
import {PAGE_SIZE} from '../../utils/constants'
import memoryUtils from "../../utils/memoryUtils";
const Option = Select.Option
/**
 * Product的默认子路由组件
 */
export default class ProductHome extends Component{
    state ={
        total:0,//当前商品的总量
        products:[], //商品的数组
        loading:false,//页面是否正在加载中
        searchName:"",//搜索的关键字
        searchType:"productName"//根据哪个字段进行搜索，默认根据productName进行搜索
    }
    initColumns=()=>{
        this.columns = [
            {
              title: '商品名称',
              dataIndex: 'name',
            },
            {
              title: '商品描述',
              dataIndex: 'desc',
            },
            {
              title: '价格',
              dataIndex: 'price',
              render:(price)=>'￥' + price //当前指定的对应属性，传入的是对应属性的值
            },
            {
                width: 100,
                title: '状态',
                // dataIndex: 'status',
                render: (product) => {
                  const {status, _id} = product
                  const newStatus = status===1 ? 2 : 1
                  return (
                    <span>
                      <Button
                        type='primary'
                        onClick={() => this.updateStatus(_id, newStatus)} //点击按钮发送请求得到数据自动修改显示
                      >
                        {status===1 ? '下架' : '上架'}
                      </Button>
                      <span>{status===1 ? '在售' : '已下架'}</span>
                    </span>
                  )
                }
              },
            {
                width:100,
                title: '操作',
                render:(product)=>{
                    return (
                        <span>
                            {/* 将product对象使用state传给目标路由组件 */}
                            <LinkButton onClick={()=>this.showDetail(product)}>详情</LinkButton>
                            <LinkButton onClick={() => this.showUpdate(product)}>修改</LinkButton>
                        </span>
                    )
                } 
            },
          ]
    }
        /*
    显示商品详情界面
    */
   showDetail = (procut) => {
    // 缓存product对象 ==> 给detail组件使用
    memoryUtils.product = procut
    this.props.history.push('/product/detail')
    }   
      /*
    显示修改商品界面
    */
    showUpdate = (procut) => {
      // 缓存product对象 ==> 给detail组件使用
      memoryUtils.product = procut
      this.props.history.push('/product/addupdate')
    }
    getProducts=async(pageNum)=>{
        this.pageNum = pageNum//保存当前pageNum
        this.setState({loading:true});//正在加载中
        const {searchName,searchType} = this.state
        let result
        //如果searchName有值，就是搜索分页
        if(searchName){
        result=await reqSearchProducts({pageNum,pageSize:PAGE_SIZE,searchName,searchType})
        }else{//一般分页
        result = await reqProducts(pageNum,PAGE_SIZE)
        }
        console.log(result);
        
        this.setState({loading:false});//加载成功
        if(result.status === 0){
            const {total,list} = result.data
            this.setState({
                total,    //当前商品的总数
                products:list
            })
        }
    }
    /*
    更新指定商品的状态
    */
    updateStatus = async (productId, status) => {
        const result = await reqUpdateStatus(productId, status)
        if(result.status===0) {
        message.success('更新商品成功')
        this.getProducts(this.pageNum)
        }
    }
    componentWillMount(){
    //获取一级分类列表
    this.initColumns()
    }
    componentDidMount(){
        this.getProducts(1)
    }
    render(){
        //取出状态数组
          const {products,total,loading,searchName,searchType} = this.state
        const title=(
            <span>
                <Select value={searchType} style={{width:150}} onChange={value=>{this.setState({searchType:value})}}>
                    <Option value="productName">按名称搜索</Option>
                    <Option value="productDesc">按描述搜索</Option>
                </Select>
                <Input placeholder="关键字" value={searchName} style={{width:150,margin:'0 15px'}} onChange={event=>{this.setState({searchName:event.target.value})}}/>
                <Button type="primary" onClick={()=>this.getProducts(1)}>搜索</Button>
            </span>
        )
        const extra=(
            <Button type="primary"  onClick={() => this.props.history.push('/product/addupdate')}>
                <Icon type = "plus"/>
                添加商品
            </Button>
        )
        return(
           <Card title={title} extra={extra}>
               <Table 
               bordered  
               rowKey="_id"
               loading={loading}
               dataSource={products}  //数据
               columns={this.columns} 
               pagination={{
                   current:this.pageNum,
                   total,
                   defaultPageSize:PAGE_SIZE,
                   showQuickJumper:true, 
                   onChange:this.getProducts//页码改变的回调，参数是改变后的页码及每页条数
                }}
               />
           </Card>
        )
    }
}
/**
 * 分页列表
 * 1.前台分页
 * 请求获取数据：一次性够获取数据，翻页时不需要再次发送请求
 * 请求接口：不需要请求的页码(pageNum)和每页显示的页数(pageSize)
 * 响应数据：所有数据的数组
 * 2.基于后端的分页
 * 请求获取数据：每次只获取当前页的数据，翻页时需要再次发送请求
 * 请求接口：需要请求的页码(pageNum)和每页显示的页数(pageSize)
 * 响应数据：当前页的数组 + 总记录数(total)
 * 
 */