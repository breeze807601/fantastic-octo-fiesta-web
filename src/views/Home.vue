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
                <el-col :span="1" :offset="6">
                    
                </el-col>
                <el-col :span="1" :offset="8">
                    <el-dropdown trigger="click">
                        <el-avatar :size="40" style="margin-top: 10px; cursor: pointer;" @error="true">
                            <img src="https://homework1015.oss-cn-beijing.aliyuncs.com/2024-07-08-15-08-281.png" />
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
                <el-col :span="4" :offset="2">
                    <el-card>
                        hello
                    </el-card>
                </el-col>
                <el-col :span="8" :offset="1">
                    <router-view />
                </el-col>
                <el-col :span="6" :offset="1">
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
import store from '@/store'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import router from '@/router';
import { ref } from 'vue';


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
    store.commit('delInfo')
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