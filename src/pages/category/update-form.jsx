import React, {Component} from 'react'
import {Form,Input} from 'antd'
import PropTypes from 'prop-types'
const Item = Form.Item
/*
更新分类的form组件
 */
class UpdateForm extends Component {
    static propTypes = {//接受传入的属性
        categoryName:PropTypes.string.isRequired,
        setForm:PropTypes.func.isRequired
    }
    componentWillMount(){
        //将form对象通过setForm 传递给父组件
        this.props.setForm(this.props.form) //进行调用
    }
  render() {
    const {categoryName} = this.props //读取传入的分类的名字
    const {getFieldDecorator} = this.props.form
    return (
     <Form>
         <Item>
         {
                 getFieldDecorator('categoryName',{
                     initialValue:categoryName,
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
export default Form.create()(UpdateForm);