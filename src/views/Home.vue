<template>
    <el-container>
        <el-header>
            <!-- 头部标签栏内容 -->
            <el-row>
                <el-col :span="2">
                    <img src="../assets/logo.jpg" alt="Logo" style="height: 60px; width: 140px;">
                </el-col>
                <el-col :span="9">
                    <div>
                        <el-menu :default-active="activeIndex" mode="horizontal" @select="handleSelect">
                            <el-menu-item index="1"><el-icon><HomeFilled /></el-icon>首页</el-menu-item>
                            <el-menu-item index="2"><el-icon><CollectionTag /></el-icon>标签</el-menu-item>
                            <el-menu-item index="3"><el-icon><MagicStick /></el-icon>动态</el-menu-item>
                        </el-menu>
                    </div>
                </el-col>
                <el-col :span="4">
                    <el-input placeholder="搜索..." v-model="search" size="large" clearable style="margin-top: 10px">
                        <template #append>
                            <el-button :icon="Search" @click="handleSearch"></el-button>
                        </template>
                    </el-input>
                </el-col>
                <el-col :span="1" :offset="7">
                    <el-tooltip effect="light" content="发送动态" placement="bottom" >
                        <el-button style="margin-top: 10px;" color="#337ecc" :dark="isDark" :icon="EditPen" size="large" circle plain/>
                    </el-tooltip>
                </el-col>
                <el-col :span="1">
                    <el-dropdown trigger="click">
                        <el-avatar :size="40" style="margin-top: 10px; cursor: pointer;border: 2px solid #dedfe0" @error="true">
                            <img :src="userInfo.pic" />
                        </el-avatar>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item @click="goToProfile">个人中心</el-dropdown-item>
                                <el-dropdown-item divided @click="logOut()">退出登录</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </el-col>
            </el-row>
        </el-header>
        <el-main>
            <el-row>
<!--                <el-col :span="4" :offset="2">-->
<!--                    <el-card>-->
<!--                        hello-->
<!--                    </el-card>-->
<!--                </el-col>-->
                <el-col :span="16" :offset="1">
                    <router-view />
                </el-col>
                <el-col :span="5" :offset="1">
                    <el-card>
                        广告
                    </el-card>
                    <el-card style="margin-top: 20px">
                        最热动态
                    </el-card>
                    <el-card style="margin-top: 20px">
                        可能感兴趣的人
                    </el-card>
                </el-col>
            </el-row>
            <!-- <router-view /> -->
        </el-main>
    </el-container>
</template>

<script setup>
document.title = "社交媒体平台-主页";

import request from '@/request/request'
import { ElMessage } from 'element-plus'
import { Search,EditPen } from '@element-plus/icons-vue'
import router from '@/router';
import {reactive, ref} from 'vue';

let userInfo = reactive({})

userInfo = JSON.parse(localStorage.getItem("userInfo"));
console.log("user",userInfo)

const activeIndex = ref('1')
function handleSelect(key) {
    // 根据 key 的值来决定跳转到哪个路由
    switch (key) {
        case '1':
            activeIndex.value = '1'
            router.push('/homePage');
            break;
        case '2':
            activeIndex.value = '2'
            router.push('/tag');
            break;
    }
}

const search = ref('')

function logOut(){
    // store.commit('delInfo')
    localStorage.clear();
    ElMessage.success('退出登录成功！')
    router.push('/')
}
// 测试
// get()
// async function get(){

//     const res = await request.get("/user/getUser")
// }
</script>

<style>
.el-header {
  padding: 0 !important; /* 清除默认的内边距 */
  border-bottom: 1px solid #dcdfe6; /* 添加下边框，颜色和宽度可以自定义 */
}
</style>