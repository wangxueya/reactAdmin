/*
用来根据老的state和指定的action生成并返回新的state的函数
 */
import {combineReducers} from 'redux'
import {
  SET_HEAD_TITLE,
  RECEIVE_USER,
  SHOW_ERROR_MSG,
  RESET_USER
} from './action-types'
/*
用来管理头部标题的reducer函数
 */
import storageUtils from "../utils/storageUtils"
   

const initHeadTitle = '首页'
 
function headTitle(state = initHeadTitle, action) {
  switch (action.type) {
    case SET_HEAD_TITLE:
      return action.data 
    default:
      return state
  }
}
   
/*
用来管理当前登陆用户的reducer函数
 */
const initUser = storageUtils.getUser() 

function user(state = initUser, action) { 
  switch (action.type) {
    case RECEIVE_USER:
      return action.user
    case SHOW_ERROR_MSG:
      const errorMsg = action.errorMsg
      return  {...state,errorMsg}
    case RESET_USER:
      return  {}
    default:
      return state
  }
}

/*
向外默认暴露的是合并产生的总的reducer函数
管理的总的state的结构:
  {
    headTitle: '首页',
    user: {}
  }
 */ 
export default combineReducers({//合并产生的总的reducer函数
  headTitle,
  user
})

/**
 * redux库的主模块 
 * 1)redux库向外暴露下面几个函数
 * createStore():接受的参数为reducer函数，返回store对象
 * combineReducers():接收包含n个reducer方法的对象，返回reducer函数
 * applyMiddleware():暂不实现
 * 
 * 2)store对象的内部结构
 * getState():返回的值为内部保存的state数据
 * dispatch():参数为action对象
 * subscribe():参数为监听内部state更新的回调函数
 */
