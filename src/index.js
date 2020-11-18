import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux'
// import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import 'antd/dist/antd.css'
import store from './redux/store'
// import storageUtils from './utils/storageUtils'
// import memoryUtils from './utils/memoryUtils'
// // 读取local中保存的user
// const user =storageUtils.getUser()
// memoryUtils.user = user
ReactDOM.render((
    <Provider store={store}>
      <App />
    </Provider>
  ), document.getElementById('root'))


serviceWorker.unregister();
