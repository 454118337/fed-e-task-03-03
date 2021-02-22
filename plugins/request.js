/**
 * 基于 axios 封装的请求模块
 * */

import axios from 'axios'

// 创建请求对象
export const request = axios.create({
    baseURL: `https://conduit.productionready.io/`
})
// 插件导出函数必须作为 default 成员
//　通过插件机制获取上下文对象
export default ({store}) => {
    // 请求拦截器
    request.interceptors.request.use(function (config) {
        // 在发送请求之前做些什么
        const {user} = store.state
        if (user && user.token) {
            config.headers.Authorization = `Token ${user.token}`
        }
        return config;
    }, function (error) {
        // 请求未发出
        // 对请求错误做些什么
        return Promise.reject(error);
    });
}
