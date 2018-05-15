import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import './css/index.css';
import './css/common.css';
import Routes from './router.js';

axios.defaults.withCredentials = true;
axios.interceptors.request.use(
    config => {
        config.url = 'http://localhost:8080'+config.url;
        return config;
    },
    err => {
        return Promise.reject(err);
    }
);

axios.interceptors.response.use(function (response) {
    // 对响应数据做处理
    return response;
}, function (error) {
    // 对响应错误做处理
    // console.log('httpError:'+error);
    return Promise.reject(error);
});

ReactDOM.render(<Routes />, document.getElementById('root'));
