import axios from "axios";
import { ElMessage } from 'element-plus'
import router from "@/router";
import store from '@/store'
const baseURL = '/api';
const instance = axios.create({baseURL})

instance.interceptors.request.use(
    config => {
        if (localStorage.getItem('token')){
            config.headers.Authorization = store.getters.getToken;
        }
        return config;
      },
      error => {
        // 对请求错误做些什么
        return Promise.reject(error);
    }
)

instance.interceptors.response.use(
    result=>{
        //判断业务状态
        if(result.data.code === 1){
            return result.data;
        }
        return Promise.reject(result.data)
    },
    err=>{
        if (err.response.status == 401) {
            // token过期
            store.commit('delInfo')
            ElMessage({
                message: "请先登录!!!",
                type: 'error',
            })
            router.push("/")
        }
        return Promise.reject(err);
    }
)

export default instance;