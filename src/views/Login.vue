<template>
    <el-card class="login">
        <el-card class="login-card" >
            <template #header>
             <div class="container">
                <div>
                    <img  src="../assets/icon.png" width="30px"  title="k8s">
                </div>
                <div style="margin-left:5px" >
                    <span>用户登录</span>
                </div>
            </div>
            </template>
            <div>
                <el-form :rules="rules" :model="form" label-width="auto" size="large">
                    <el-form-item prop="username">
                        <el-input v-model="form.username" placeholder="请输入用户名"  :prefix-icon="User" />
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input v-model="form.password" placeholder="请输入密码" :prefix-icon="Lock" show-password />
                    </el-form-item>
                    <el-row justify="end">
                        <el-col :span="3">
                            <el-form-item>
                                <el-link @click="toRegister()" :underline="false">注册 →</el-link>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item >
                        <el-button class="btn btn-loading" type="primary" :loading="loading" size="large" @click="login()" round>
                            <span v-if="!loading">登录</span>
                            <span v-else>登录中...</span>
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
    </el-card>
</template>

<script setup>
document.title = "社交媒体平台-登录";

import router from "@/router/index.js"
import {reactive, ref} from 'vue'
import request from "@/request/request"
import { ElMessage } from 'element-plus'
import { User,Lock } from '@element-plus/icons-vue'

const form = reactive({
    username: '',
    password: ''
})

const rules = {
  username: [
    //required表示是否必须输入
    // message表示不满足规则显示的信息
    //trigger：表示显示时机，blur表示是失去焦点，值换成change表示实时
    { required: true, message: '请输入用户名', trigger: 'blur' },],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const loading = ref(false)

async function login(){
    if (form.username == '' || form.password == ''){
        ElMessage({
            message: "输入内容为空",
            type: 'error',
        })
        return
    }
    loading.value = true;
    const params = new URLSearchParams();
    params.append("username",form.username)
    params.append("password",form.password)
    await request.post("/user/login",params).then(res => {
        ElMessage({
            message: res.data.msg ? res.data.msg : "登录成功！",
            type: 'success',
        });
        let userInfo = JSON.stringify(res.data.user);
        localStorage.setItem("token",res.data.token)
        localStorage.setItem("userInfo",userInfo)
        loading.value = false
        router.push('/home')
    }).catch(err => {
        ElMessage({
            message: err.msg ? err.msg : "登录失败！",
            type: 'error',
        })
        loading.value = false
    })
}
function toRegister(){
    router.push("/register")
}
</script>

<style scoped>
.login{
    position: absolute;
    width: 99.9%;
    height: 99.5%;
    background-image: url(../assets/login.jpg);
    background-size:cover;
}
.login-card{
    position: fixed;
    left: 50%;
    top: 50%;
    width: 450px;
    transform: translate(-50%, -50%);
}
.container{
    display: flex;
    justify-content: center;
    align-items: center;
}
.btn{
    display: block;
    margin:  auto;
    width: 40%;
}
.btn-loading:before {
    content: "";
    display: inline-block;
    vertical-align: middle;
    margin-right: -0.0em;
}
</style>