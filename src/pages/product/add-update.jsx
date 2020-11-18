import  React,{Component} from 'react'
import {
    Card,
    Icon,
    Form,
    Input,
    Cascader,
    Button,
    message
  } from 'antd'
import LinkButton from '../../components/link-button'
import {reqCategorys, reqAddOrUpdateProduct} from '../../api'
import memoryUtils from "../../utils/memoryUtils";
import PicturesWall from './pictures-wall'
import RichTextEditor from './rich-text-editor'
const {Item} = Form
const { TextArea } = Input

/**
 * Product的添加和更新的子路由组件
 */
class ProductAddUpdate extends Component{
  state = {
    options:[]
  };
  
  constructor (props) {
    super(props)
    // 创建用来保存ref标识的标签对象的容器
    this.pw = React.createRef()
    
    this.editor = React.createRef()
  }
  initOptions =async (categorys) => {
    const options= categorys.map(c=>({
      value: c._id,
      label: c.name,
      isLeaf: false, // 不是叶子
    }))

    // 如果是一个二级分类商品的更新
    const {isUpdate, product} = this
    const {pCategoryId} = product
    if(isUpdate && pCategoryId!=='0') {//如果是一个二级分类商品的更新可以
      // 获取对应的二级分类列表
      const subCategorys = await this.getCategorys(pCategoryId)
      // 生成二级下拉列表的options
      const childOptions = subCategorys.map(c => ({
        value: c._id,
        label: c.name,
        isLeaf: true
      }))

      // 找到当前商品对应的一级option对象***
      const targetOption = options.find(option => option.value===pCategoryId)

      // 关联对应的一级option上
      targetOption.children = childOptions
    }

    //更新options的数据
    this.setState({
      options
    })
  }
  /**
   * 异步获取一级/二级分类列表并显示
   * async函数的返回值是一个新的promise对象,promise的结果和值由async的结果来决定的
   */
  getCategorys = async (parentId) => { //首先开始渲染的时候传入的parentId为0
    const result = await reqCategorys(parentId)   // {status: 0, data: categorys}
    if (result.status===0) {
      const categorys = result.data
      // 如果是一级分类列表
      if (parentId==='0') {
        this.initOptions(categorys)
      } else { // 二级列表
        return categorys  // 返回二级列表 ==> 当前async函数返回的promsie就会成功且value为categorys
      }
    }
  }
  

    submit = () => {
         // 进行表单验证, 如果通过了, 才发送请求
    this.props.form.validateFields(async (error, values) => {
      if (!error) {

        // 1. 收集数据, 并封装成product对象
        const {name, desc, price, categoryIds} = values
        console.log({name, desc, price, categoryIds});
        
        let pCategoryId, categoryId
        if (categoryIds.length===1) {
          pCategoryId = '0'
          categoryId = categoryIds[0]
        } else {
          pCategoryId = categoryIds[0]
          categoryId = categoryIds[1]
        }
        /**
         * 父组件调用子组件里面的方法，先创建保存ref标识的标签对象容器，
        然后当一个ref通过render放入一个元素中，一个对节点的引用可以通过ref的current属性得到；
        因此可以对这个节点进行操作调用节点里面的函数
         */
        const imgs = this.pw.current.getImgs() 
        const detail = this.editor.current.getDetail()

        const product = {name, desc, price, imgs, detail, pCategoryId, categoryId}

        // 如果是更新, 需要添加_id
        if(this.isUpdate) {
          product._id = this.product._id
        }

        // 2. 调用接口请求函数去添加/更新
        const result = await reqAddOrUpdateProduct(product)

        // 3. 根据结果提示
        if (result.status===0) {
          message.success(`${this.isUpdate ? '更新' : '添加'}商品成功!`)
          this.props.history.goBack()
        } else {
          message.error(`${this.isUpdate ? '更新' : '添加'}商品失败!`)
        }
      }
    })
    }
    /**
     * 用于加载下一级列表的回调函数
     */
    loadData =async selectedOptions => {   //级联选择
      /**
       console.log(selectedOptions[0]);
      value: "5e685530c2a5cc1ba0eeab5b"
      label: "家用电器"
      isLeaf: false
      loading: false
       */
      //得到选择的option对象
      const targetOption = selectedOptions[0];
      // 显示loading
      targetOption.loading = true;
      //根据选中的分类，请求获取下一级分类targetOption.value=5e685530c2a5cc1ba0eeab5b....
      const subCategorys =await this.getCategorys(targetOption.value);
      // 隐藏loading
      targetOption.loading = false;
        // 二级分类数组有数据
    if (subCategorys && subCategorys.length>0) {
      // 生成一个二级列表的options
      const childOptions = subCategorys.map(c => ({
        value: c._id,
        label: c.name,
        isLeaf: true
      }))
      // 关联到当前option上
      targetOption.children = childOptions
    } else { // 当前选中的分类没有二级分类
      targetOption.isLeaf = true
    }

    // 更新options状态
    this.setState({
      options: [...this.state.options],
    })
    };
    /**
     * 验证价格的自定义验证函数
     */
    validatePrice = (rule, value, callback) =>{
      if (value*1 > 0) {//value*1变成数字
        callback() // 验证通过
      } else {
        callback('价格必须大于0') // 验证没通过
      }
    }
    componentDidMount () {
      this.getCategorys('0')
    }
    componentWillMount(){
      // 取出携带的state
      const product = memoryUtils.product  // 如果是添加没值, 否则有值
      
      // 保存是否是更新的标识
      this.isUpdate = !!product._id//强制转换boolean类型
      // 保存商品(如果没有, 保存是{})
      this.product = product || {}
    }
    render(){
        const {isUpdate,product} = this
        const {pCategoryId, categoryId,imgs,detail} = product
        console.log({imgs});
        
        //用来接受级联分类ID的数组
        const categoryIds=[]
        if(isUpdate){
           // 商品是一个一级分类的商品 
          if(pCategoryId==='0') {
            categoryIds.push(categoryId)
          } else {
            // 商品是一个二级分类的商品
            categoryIds.push(pCategoryId)
            categoryIds.push(categoryId)
          }
        }
        //指定item布局的配置对象
        const formItemLayout = { //antd的栅格布局，一共是24格
            labelCol: { span: 2 },//左侧label的宽度
            wrapperCol: { span: 8 },//指定右侧包裹的宽度
          };
        const title=(
            <span>
                <LinkButton onClick={() => this.props.history.goBack()}>
                    <Icon type='arrow-left' style={{fontSize: 20}}/>
                </LinkButton>
                <span>{isUpdate ? '修改商品' : '添加商品'}</span>
            </span>
        )
        
        const {getFieldDecorator} = this.props.form  //将数据收集
        return(
            <Card title={title}>
                <Form {...formItemLayout}>
                    <Item label="商品名称">
                        {
                        getFieldDecorator('name', {
                            initialValue: product.name,
                            rules: [
                              {required: true, message: '必须输入商品名称'}
                            ]
                          })( <Input placeholder='请输入商品名称'/>)
                       
                        }
                    </Item>
                    <Item label="商品描述">
                        {
                        getFieldDecorator('desc', {
                            initialValue: product.desc,
                            rules: [
                              {required: true, message: '必须输入商品描述'}
                            ]
                          })(<TextArea placeholder="请输入商品描述" autoSize={{ minRows: 2, maxRows: 6 }} />)
                        }
                    </Item>
                    <Item label="商品价格">
                        {
                        getFieldDecorator('price', {
                            initialValue: product.price,
                            rules: [
                              {required: true, message: '必须输入商品价格'},
                              {validator: this.validatePrice}
                            ]
                          })(<Input type='number' placeholder='请输入商品价格' addonAfter='元'/>)
                        }
                    </Item>
                    <Item label="商品分类">
                        {
                             getFieldDecorator('categoryIds', {
                                initialValue: categoryIds,
                                rules: [
                                  {required: true, message: '必须指定商品分类'}
                                ]
                              })(  <Cascader
                                placeholder='请指定商品分类'
                                options={this.state.options}//需要显示的列表数据数组
                                loadData={this.loadData}//当选择每个列表项，加载下一个列表项的监听回调
                              />)
                        }

                    </Item>
                    <Item label="商品图片">
                      <PicturesWall ref={this.pw} imgs={imgs}/>
                    </Item>
                    <Item label="商品详情" labelCol={{span: 2}} wrapperCol={{span: 20}}>
                      <RichTextEditor ref={this.editor} detail={detail}/>
                    </Item>
                    <Item>
                    <Button type='primary' onClick={this.submit}>提交</Button>
                    </Item>
                </Form>
            </Card>
        )
    }
}
export default Form.create()(ProductAddUpdate)