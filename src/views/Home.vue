<template>
    <el-container>
        <el-header class="el-header" style="background-color: white">
            <!-- 头部标签栏内容 -->
            <el-row >
                <el-col :span="2">
                    <img src="../assets/logo.jpg" alt="Logo" style="height: 60px; width: 140px;">
                </el-col>
                <el-col :span="7">
                    <div>
                        <el-menu :default-active="activeIndex" mode="horizontal" @select="handleSelect">
                            <el-menu-item index="1"><el-icon><HomeFilled /></el-icon>首页</el-menu-item>
                            <el-menu-item index="2"><el-icon><CollectionTag /></el-icon>标签</el-menu-item>
                            <el-menu-item index="3"><el-icon><MagicStick /></el-icon>动态</el-menu-item>
                        </el-menu>
                    </div>
                </el-col>
                <el-col :span="6">
                    <el-input placeholder="搜索..." v-model="search" size="large" clearable style="margin-top: 10px">
                        <template #append>
                            <el-button :icon="Search" @click="handleSearch"></el-button>
                        </template>
                    </el-input>
                </el-col>
                <el-col :span="1" :offset="1">
                    <div style="display: flex; justify-content: center; align-items: center; height: 100%;">
                        <el-tooltip effect="light" content="发送动态" placement="bottom" >
                            <el-button @click="dialogVisible = true" style="margin-bottom: 5px;" color="#337ecc" :icon="EditPen" size="large" circle plain/>
                        </el-tooltip>
                    </div>
                </el-col>
                <el-col :span="1" :offset="6">
                    <div style="display: flex; justify-content: center; align-items: center; height: 100%;">
                        <el-dropdown trigger="click">
                            <el-avatar :size="40" style="margin-bottom: 5px;cursor: pointer;border: 2px solid #dedfe0" @error="true">
                                <img :src="userInfo.pic" />
                            </el-avatar>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item @click="goToProfile">个人中心</el-dropdown-item>
                                    <el-dropdown-item divided @click="logOut()">退出登录</el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                    </div>
                </el-col>
            </el-row>
        </el-header>
        <el-main style="background-color: #f5f5f5;">
            <el-row>
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
        </el-main>
    </el-container>
    <!--发布动态弹窗-->
    <el-dialog v-model="dialogVisible" :before-close="beforeClose" title="发布动态" width="40%" center destroy-on-close>
        <edit />
    </el-dialog>
    <!--回到顶部-->
    <el-tooltip effect="light" content="回到顶部" placement="top" >
        <el-backtop :right="100" :bottom="100" />
    </el-tooltip>
</template>

<script setup>
document.title = "社交媒体平台-主页";

import request from '@/request/request'
import { ElMessage,ElMessageBox } from 'element-plus'
import { Search,EditPen } from '@element-plus/icons-vue'
import router from '@/router';
import {reactive, ref} from 'vue';
import Edit from '../components/Edit.vue'

// 登录用户信息
let userInfo = reactive({})
userInfo = JSON.parse(localStorage.getItem("userInfo"));
console.log("user",userInfo)

// 标签切换页面
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

const search = ref('')  // 搜索内容

const dialogVisible = ref(false);  // 是否弹出发送动态编辑框
function beforeClose(){  // 关闭动态编辑前提醒是否确认关闭
    ElMessageBox.confirm(
        '关闭之后将不会保存编辑，确认关闭？',
        '提示',
        {confirmButtonText: '确定',cancelButtonText: '取消',type: 'warning',}
    ).then(() => {
        dialogVisible.value = false
    })
}

function logOut(){  // 登出
    ElMessageBox.confirm(
        '是否确认退出登录？',
        '提示',
        {confirmButtonText: '确定',cancelButtonText: '取消',type: 'warning',}
    ).then(() => {
        localStorage.clear();
        ElMessage.success('退出登录成功！')
        router.push('/')
    })
}
</script>

<style>
.el-header {
    padding: 0 !important;
    border-bottom: 1px solid #dcdfe6;
    position: sticky;
    top: 0;
    z-index: 1000;
}
</style>