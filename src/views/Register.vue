<template>
    <el-card class="register">
        <el-card class="register-card" >
            <template #header>
             <div class="container">
                <div>
                    <img  src="../assets/icon.png" width="30px"  title="k8s">
                </div>
                <div style="margin-left:5px" >
                    <span>用户注册</span>
                </div>
            </div>
            </template>
            <div>
                <el-form :rules="rules" :model="user" label-width="auto" size="large" ref="registerFormRef">
                    <el-form-item prop="username">
                        <el-input v-model="user.username" placeholder="请输入用户名" :prefix-icon="User" />
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input v-model="user.password" placeholder="请输入密码" :prefix-icon="Lock" show-password />
                    </el-form-item>
                    <el-form-item prop="pw">
                        <el-input v-model="user.pw" :prefix-icon="Lock" placeholder="请确认密码" show-password />
                    </el-form-item>
                    <el-form-item prop="nickname">
                        <el-input v-model="user.nickname" :prefix-icon="Grape" placeholder="请输入昵称"/>
                    </el-form-item>
                    <el-form-item prop="phone">
                        <el-input v-model="user.phone" placeholder="请输入电话" :prefix-icon="Iphone" />
                    </el-form-item>
                    <el-form-item prop="idCard">
                        <el-input v-model="user.idCard" placeholder="请输入身份证号码" :prefix-icon="CreditCard" />
                    </el-form-item>
                    <el-form-item label="性别：">
                        <el-radio-group v-model="user.sex">
                            <el-radio value="0" size="large">男</el-radio>
                            <el-radio value="1" size="large">女</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <div class="login">
                        <el-form-item>
                            <el-link @click="toLogin()" :underline="false">
                                ← 登录
                            </el-link>
                        </el-form-item>
                    </div>
                    <el-form-item >
                        <el-button class="btn btn-loading" type="primary" :loading="loading" size="large" @click="onRegisterClick()" round>
                            <span v-if="!loading">注册</span>
                            <span v-else>注册中...</span>
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
    </el-card>
</template>

<script setup>
document.title = "社交媒体平台-注册";

import router from "@/router";
import request from "@/request/request"
import { ElMessage } from 'element-plus'
import { User,Lock,Grape,Iphone,CreditCard } from '@element-plus/icons-vue';
import {reactive, ref} from 'vue';

const user = reactive({
    username: '',
    password: '',
    pw:'',
    nickname: '',
    sex: '0',
    idCard: '',
    phone: '',
})

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  pw: [{ required: true, message: '请确认密码', trigger: 'blur' }],
  nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
  idCard: [{ required: true, message: '请输入身份证号', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入电话', trigger: 'blur' }],
}

const registerFormRef = ref(null);

const onRegisterClick = () => {
  registerFormRef.value.validate(valid => {
    if (valid) {
      // 表单验证成功，可以提交表单或执行其他操作
      register()
    } else {
      // 验证失败，Element Plus会自动高亮错误的表单项
      ElMessage.error('请检查注册内容输入!');
    }
  });
};

const loading = ref(false)
async function register(){
    loading.value = true;
    if (user.pw != user.password) {
        ElMessage.error('两次密码不一致!');
        loading.value = false;
        return;
    }
    await request.post("/user/register",user).then(res => {
        console.log("res",res);
        ElMessage.success('注册成功!')
        loading.value = false;
        toLogin();
    }).catch(err => {
        console.log("err",err);
        ElMessage.error('注册失败!');
        loading.value = false
    })
}

function toLogin(){
    router.push("/")
}
</script>

<style>
.register{
    position: absolute;
    width: 99.9%;
    height: 99.5%;
    background-image: url(../assets/login.jpg);
    background-size:cover;
}
.register-card{
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