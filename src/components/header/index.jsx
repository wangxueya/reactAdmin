import  React,{Component} from 'react'
import {withRouter} from 'react-router-dom'
import {Modal} from 'antd'
import {connect} from 'react-redux' 
import {formateDate} from '../../utils/dateUtils'
import {reqWeather} from '../../api'
// import memoryUtils from '../../utils/memoryUtils'
// import storageUtils from '../../utils/storageUtils'
import menuList from '../../config/menuConfig.js'
import LinkButton from '../link-button'
import './index.css'
import {logout} from '../../redux/actions' 
import { Avatar} from 'antd';
class Header extends Component{
    state={
        currentTime:formateDate(Date.now()),
        dayPictureUrl:'',
        weather:''
    }
    getTime = () =>{
        this.intervalId=setInterval(()=>{
            const currentTime = formateDate(Date.now())
            this.setState({currentTime})
        },1000)
    }
    getWeather = async() =>{
        const {dayPictureUrl,weather} =  await reqWeather('昆山');
        this.setState({dayPictureUrl,weather})
    }
    getTitle = () =>{
        const path = this.props.location.pathname;
        let title
        menuList.forEach(item => {
            if(item.key===path){
                title = item.title
            }else if(item.children){
                const cItem = item.children.find(cItem =>path.indexOf(cItem.key) === 0)
                if(cItem){
                    title = cItem.title;
                }
            }
        })
        return title

    }
    logout = () =>{
        Modal.confirm({
            // icon: <ExclamationCircleOutlined />, 
            content: '确定退出吗？',
            onOk:()=> {
            console.log('OK',this);
                this.props.logout()
            }
        })
    }
    /**
     * 第一次render()之后执行一次
     * 一般在执行异步操作：发ajax请求/启动定时器
     */
    componentDidMount(){
        this.getTime()
        this.getWeather()
    }
    /**
     * 当前组件卸载之前
     */
    componentWillUnmount(){
        //清楚定时器
        clearInterval(this.intervalId)
    }

    render(){
        const {currentTime,dayPictureUrl,weather} = this.state;
        const username = this.props.user.username

        // const title = this.getTitle()
        const title = this.props.headTitle
        return(
            <div className='header'>
                <div className='header-top'>
                    <span>欢迎，{username}</span>
                    <Avatar size="small" icon="user" />
                    <LinkButton onClick={this.logout}>退出</LinkButton>
                </div>
                <div className='header-bottom'>
                    <div className='header-bottom-left'>{title}</div>
                    <div className='header-bottom-right'>
                        <span>{currentTime}</span>
                        <img src={dayPictureUrl} alt="weather"/>
                        <span>{weather}</span>
                    </div>
                </div>
            </div>
        )
    }
}
export default connect(
    state=>({headTitle:state.headTitle,user:state.user}),
    {logout}
)(withRouter(Header)) 