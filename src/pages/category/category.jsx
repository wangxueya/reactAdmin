import  React,{Component} from 'react'
import {Card,Table,Button,Icon, message,Modal} from 'antd'
import LinkButton from '../../components/link-button'
import {reqCategorys,reqUpdateCategory,reqAddCategory} from '../../api'
import AddForm from './add-form'
import UpdateForm from './update-form'
// 商品分类
export default class Category extends Component{
  state = {
    loading:false,//是否正在获取数据中
    categorys:[],//一级分类列表
    subCategorys:[],//二级分类列表
    parentId:'0',//当前需要显示的分类列表的父分类ID
    parentName:'',//当前需要显示的分类列表的父分类名称
    showStatus:0,//标识添加/更新的确认框是否显示，0都不显示，1显示添加，2显示更新
  }
  /**
   * 初始化Table所有列的数组
   */
  initColumns = () =>{
    this.columns = [
      {
        title: '分类名称',
        dataIndex: 'name',
      },
      {
        title: '操作',
        width:300,
        render: (category) =>(
            <span>
                <LinkButton onClick={()=>{this.showUpdate(category)}}>修改分类</LinkButton>
                {/* 如何向事件回调函数传递参数：先定义一个匿名函数，在函数调用处理的函数并传入一个数据 */}
                {this.state.parentId==='0'?<LinkButton onClick={()=>{this.showSubCategorys(category)}}>查看子分类</LinkButton>:null}
            </span>
        )
      }
    ]
    
  }
  /**
   * 异步获取一级/二级分类列表显示
   * 如果没有指定根据状态中的parentId请求，如果指定了根据指定的发送请求
   */
  getCategorys = async(parentId) =>{   
    
    //在发送请求前，显示loading
    this.setState({loading:true})
    // const {parentId} = this.state
    parentId = parentId || this.state.parentId //state中parentId的值或者本身parentId的值(相当于jQuery中的data)
    const result =await reqCategorys(parentId)
    //在请求结束完成后，隐藏loading
    this.setState({loading:false})
    if(result.status === 0){
      //取出分类数组(可能是一级的也可能是二级的)
      const categorys = result.data
      if(parentId==='0'){
        //更新一级分类状态
        this.setState({
          categorys
        })
      }else{
         //更新二级分类状态
         this.setState({
          subCategorys:categorys
        })
      }
     
    }else{
      message.error('获取分类列表失败');
    }
  }
  /**
   * 显示指定一级分类对象的二级子对象
   */
  showSubCategorys=(category)=>{
    //更新状态
    this.setState({
      parentId:category._id,
      parentName:category.name
    },()=>{//在状态更新且重新render后执行
      // 获取二级分类列表
      this.getCategorys()
    })
   //setState不是立即获取最新的状态，因为setState是异步获取状态的
  }
  showCategorys=()=>{
    this.setState({
      parentId:'0',
      parentName:'',
      subCategorys:[]
    })
  }
  /**
   * 响应点击取消：隐藏确定框
   */
  handleCancel=()=>{
    //重置所有的字段,清除输入的数据
    this.form.resetFields();
    //隐藏弹框
    this.setState({
      showStatus:0
    })
  }
//显示添加的确认框
  showAdd=()=>{
    this.setState({
      showStatus:1
    })
  }
/**
 * 添加分类
 */
addCategory= async()=>{
  this.form.validateFields(async(err,values)=>{
    if(!err){
       //隐藏弹框
      this.setState({
        showStatus:0
      })
      //收集数据，并提交添加数据的请求
      const {parentId,categoryName} =values;//读取addForm中的值
      //重置所有的字段,清除输入的数据,不可以放到获取输入数据之前写,因为已经清除数据了不能得到输入数据
      this.form.resetFields();
      const result = await reqAddCategory(categoryName,parentId);
      //重新获取分类列表显示
            if(result.status === 0){
              //添加的分类就是当前列表下的分类
              if(parentId === this.state.parentId){
                //重新获取当前分类类表显示
                this.getCategorys();
              }else if(parentId ==="0"){//在二级分类列表下添加一级分类列表，但不需要显示一级分类列表
                this.getCategorys("0");
              }
            }else{
              console.log('添加异常，请重试');
            }
          }
        })
}
//显示更新的确认框
showUpdate=(category)=>{
  //保存分类对象,使其他函数可以是使用,可以让updateFrom组件可以使用将其传进去
  this.category = category
  this.setState({
    showStatus:2
  })
}

 /**
  * 更新分类
  */
updateCategory= ()=>{
//进行表单验证，只有通过了才处理
  this.form.validateFields(async(err,values)=>{
    if(!err){
      //关闭弹框，发请求更新，重新显示列表
      this.setState({
        showStatus:0
      });
      const categoryId = this.category._id;
      const {categoryName} =values;//读取updateForm中的值
      
      // const categoryName =this.form.getFieldValue('categoryName');//读取updateForm中的值
      //重置所有的字段,清除输入的数据,不可以放到获取输入数据之前写,因为已经清除数据了不能得到输入数据
      this.form.resetFields();
      const result = await reqUpdateCategory({categoryId, categoryName});
      if(result.status === 0){
        this.getCategorys();
      }else{
        console.log('更新异常，请重试');
      }
    }
  })
}

  /**
   * 为第一次render()准备数据
   */
  componentWillMount(){
    //获取一级分类列表
   this.initColumns()
  }
  /**
   * 发送异步ajax请求
   * 执行一步任务
   */
  componentDidMount(){
    this.getCategorys();
  }
    render(){
      //读取状态数据
      const {categorys,subCategorys,parentId,parentName,loading,showStatus} = this.state
      //读取指定的分类，将其传给指定的组件
      const category = this.category || {} //如果还没有指定一个空对象，在刚开始进来的时候没有点击事件所以category是空的初始化不存在
        const title =parentId==='0'?'一级分类列表':(
          <span>
          <LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton>
          <Icon type='arrow-right' style={{marginRight:5}}/>
          <span>{parentName}</span>
          </span>
        )
        const extra =(
            <Button type='primary' onClick={this.showAdd}>
                 添加
            </Button>
        )
          
        return(
              <Card title={title} extra={extra}>
            <Table bordered rowKey="_id" 
            loading={loading}
            dataSource={parentId==='0'?categorys:subCategorys}//根据parentId的值来判断state中显示一级列表还是二级列表
            columns={this.columns} 
            pagination = {{defaultPageSize:5,showQuickJumper:true}}
            />

        <Modal title="添加分类"
          visible={showStatus===1}
          onOk={this.addCategory}
          onCancel={this.handleCancel}
        >
          <AddForm setForm={(form)=>{this.form = form}} categorys={categorys} parentId={parentId}/>
        </Modal>

        <Modal
          title="更新分类"
          visible={showStatus===2}
          onOk={this.updateCategory}
          onCancel={this.handleCancel}
        >
          <UpdateForm categoryName={category.name} setForm={(form)=>{this.form = form}}/> 
        </Modal>
          </Card>
        )
    }
}