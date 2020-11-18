import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import {
  Form,
  Input,
  Tree
} from 'antd'
import menuList from '../../config/menuConfig'

const Item = Form.Item

const { TreeNode } = Tree;

/*
添加分类的form组件
 */
export default class AuthForm extends PureComponent {

  static propTypes = {
    role: PropTypes.object
  }

  constructor (props) {
    super(props)

    // 根据传入角色的menus生成初始状态,某一个具体的人的menus
    const {menus} = this.props.role
    this.state = {
      checkedKeys: menus//将赋值为被选中的对象
    }
  }

  /*
  为父组件提交获取最新menus数据的方法
   */
  getMenus = () => this.state.checkedKeys


  getTreeNodes = (menuList) => {
    // console.log(menuList);
    return menuList.reduce((pre, item) => {
      pre.push(
        <TreeNode title={item.title} key={item.key}>
          {item.children ? this.getTreeNodes(item.children) : null}
        </TreeNode>
      )
      return pre
    }, [])
  }

  // 选中某个node时的回调,使其记录选中的项，进行重新赋值
  onCheck = checkedKeys => { //checkedKeys 所有选中的key的数组
    console.log('onCheck', checkedKeys);
    this.setState({ checkedKeys });
  };


  componentWillMount () {
    this.treeNodes = this.getTreeNodes(menuList)
  }

  // 根据新传入的role来更新checkedKeys状态
  /*
  当组件接收到新的属性时自动调用*****
   */
  componentWillReceiveProps (nextProps) {
    // console.log('componentWillReceiveProps()', nextProps)
    const menus = nextProps.role.menus//最新的role
    this.setState({//本来进入render的流程，并没有重新render
      checkedKeys: menus
    })
    // this.state.checkedKeys = menus //和上面的最终结果是一样的，真正平常在更新状态的时候是不能这样的
  }

  render() {
    // console.log('AuthForm render()')
    const {role} = this.props
    // console.log(role);
    const {checkedKeys} = this.state
    // 指定Item布局的配置对象
    const formItemLayout = {
      labelCol: { span: 4 },  // 左侧label的宽度
      wrapperCol: { span: 15 }, // 右侧包裹的宽度
    }

    return (
      <div>
        <Item label='角色名称' {...formItemLayout}>
           <Input value={role.name} disabled/>   
        </Item>

        <Tree
          checkable
          defaultExpandAll={true}//展开所有节点
          checkedKeys={checkedKeys}
          onCheck={this.onCheck}  // 点击监听选中某个node时的回调,使其记录选中的项，进行重新赋值
        >
          <TreeNode title="平台权限" key="all">
            {this.treeNodes}
          </TreeNode>
        </Tree>
      </div>
    )
  }
}