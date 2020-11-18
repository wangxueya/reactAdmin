import React, {Component} from 'react'
import {Form,Select,Input} from 'antd'
import PropTypes from 'prop-types'
const Item = Form.Item
const Option = Select.Option
/*
添加分类的form组件
 */
class AddForm extends Component {
    static propTypes = {//接受传入的属性
        setForm:PropTypes.func.isRequired,
        categorys:PropTypes.array.isRequired,//一级分类的数组
        parentId:PropTypes.string.isRequired//父分类的ID
    }
    componentWillMount(){
        //将form对象通过setForm 传递给父组件
        this.props.setForm(this.props.form)
    }
  render() {
    const {categorys,parentId} =this.props
    const {getFieldDecorator} = this.props.form
    return (
     <Form>
         <Item>
             {
                 getFieldDecorator('parentId',{
                     initialValue:parentId
                 })(
                    <Select>
                        <Option value='0'>一级分类</Option>
                        {
                            categorys.map(c=> <Option value={c._id} key={c._id}>{c.name}</Option>  )
                            
                        }
                    </Select>
                 )
             }
         </Item>

         <Item>
         {
                 getFieldDecorator('categoryName',{
                     initialValue:'',
                     rules:[
                         {required:true,message:'分类名称必须输入'}
                     ]
                 })(
                    <Input placeholder='请输入分类名称'></Input>
                 )
             }
         </Item>
         
     </Form>
    )
  }
}
export default Form.create()(AddForm);