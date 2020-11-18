import React, {Component} from 'react'
import {
  Card,
  Button,
  Table,
  Modal,
  message
} from 'antd'
import {connect} from 'react-redux'
import {PAGE_SIZE} from "../../utils/constants"
import {reqRoles,reqAddRole,reqUpdateRole} from '../../api'
import {formateDate} from '../../utils/dateUtils'//时间格式化的函数
import AddForm from './add-form'
import AuthForm from './auth-form'
import {logout} from '../../redux/actions'
/*
角色路由
 */
class Role extends Component {
    state = {
        roles: [], // 所有角色的列表
        role:{},//选中的role
        isShowAdd:false,// 是否显示添加界面
        isShowAuth:false//是否显示设置权限界面
    }

    constructor (props) {
        super(props)
        //设置保存auth的容器，里面有current属性调用其本身的函数(从而达到使其父组件可以调用子组件的目的)
        this.auth = React.createRef()
        // console.log(this.auth);
        
      }

  initColumn = () => {
    this.columns = [
      {
        title: '角色名称',
        dataIndex: 'name'
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        render: formateDate
        // render: (create_time) => formateDate(create_time)
      },
      {
        title: '授权时间',
        dataIndex: 'auth_time',
        render: formateDate  //(auth_time) => formateDate(auth_time)
      },
      {
        title: '授权人',
        dataIndex: 'auth_name'
      },
    ]
  }

  getRoles = async () => {
    const result = await reqRoles()
    console.log(result);
    
    if (result.status===0) {
      const roles = result.data
      this.setState({
        roles
      })
    }
  }

  onRow = (role) => {
    return {
      onClick: event => { // 点击行
        // console.log('row onClick()', role)
        // alert('点击行')
        this.setState({
            role
          })
      },
    }
  }
  
  /*
  添加角色
   */
  addRole = () => {
      // 进行表单验证, 只能通过了才向下处理
    this.form.validateFields(async (error, values) => {
        if (!error) {
            // console.log(values);
            
          // 隐藏确认框
          this.setState({
            isShowAdd: false
          })
          //收集输入数据
          const {roleName} = values
          this.form.resetFields()

          //请求添加，根据提示列表显示
          const result = await reqAddRole(roleName)
         console.log(result);
          if(result.status === 0){
            message.success('添加角色成功');
            // this.getRoles()
          // 新产生的角色
          const role = result.data
          // 更新roles状态
          /*const roles = this.state.roles
          roles.push(role)
          this.setState({
            roles
          })*/
          
          // 更新roles状态: 基于原本状态数据更新
          this.setState(state => ({
            roles: [...state.roles, role]
          }))



          }else{
            message.error('添加角色失败');
          }
        }
        
    })
  }

   /*
  更新角色
   */
  updateRole =async() => {

    // 隐藏确认框
    this.setState({
      isShowAuth: false
    })

    const role = this.state.role
    // 得到最新的menus
    const menus = this.auth.current.getMenus()//得到其已选中的menus  
    role.menus = menus
    role.auth_time = Date.now()
    role.auth_name = this.props.user.username //授权人是现在已登录并且授权的

    // 请求更新
     const result = await reqUpdateRole(role)
    //  console.log(result);
     
     if (result.status===0) {
       // this.getRoles()
       // 如果当前更新的是自己角色的权限, 强制退出
       if (role._id === this.props.user.role_id) {
        this.props.logout();
         message.success('当前用户角色权限成功')
       } else {
         message.success('设置角色权限成功')
         this.setState({
           roles: [...this.state.roles]
         })
       }
     }

}
  componentWillMount () {
    this.initColumn()
  }

  componentDidMount () {
    this.getRoles()
  }

  render() {
    const {roles,role,isShowAdd,isShowAuth} = this.state

    const title = (
      <span>
        <Button type='primary' onClick={()=>this.setState({isShowAdd:true})}>创建角色</Button> &nbsp;&nbsp;
        <Button type='primary' onClick={()=>this.setState({isShowAuth:true})} disabled={!role._id}>设置角色权限</Button>
      </span>
    )

    return (
      <Card title={title}>
        <Table
          bordered
          rowKey='_id'
          dataSource={roles}
          columns={this.columns}
          pagination={{defaultPageSize: PAGE_SIZE}}
          rowSelection={{
            type: 'radio',//设置类型为单选
            selectedRowKeys: [role._id],//指定选中项的 key 数组，需要和 onChange 进行配合
            onSelect: (role) => { // 选择某个radio时回调,用户手动选择/取消选择某行的回调
              this.setState({
                role
              })
            }
          }}  
          onRow={this.onRow}//设置行属性
        />

        <Modal
          title="添加角色"
          visible={isShowAdd}
          onOk={this.addRole}
          onCancel={() => {
            this.setState({isShowAdd: false})
            this.form.resetFields()
          }}
        >
            <AddForm setForm={(form) => this.form = form}/>
        </Modal>

        <Modal
          title="设置角色权限"
          visible={isShowAuth}
          onOk={this.updateRole}
          onCancel={() => {
            this.setState({isShowAuth: false})
          }}
        >
          <AuthForm ref={this.auth}  role={role}/>
        </Modal>
      </Card>

      
    )
  }
}
export default connect(
  state=>({user:state.user}),
  {logout}
)(Role)