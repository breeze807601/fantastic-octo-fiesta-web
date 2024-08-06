<template>
    <el-row>
        <el-col :span="4" :offset="5">
            <el-menu @select="handleSelect">
                <div class="titleSpan">
                    <span>个人主页</span>
                </div>
                <el-menu-item index="/myPage">
                    <el-icon><user /></el-icon>
                    <template #title>我的主页</template>
                </el-menu-item>
                <el-menu-item index="/myAttention">
                    <el-icon><Star /></el-icon>
                    <template #title>我的关注</template>
                </el-menu-item>
                <el-menu-item index="/myFans">
                    <el-icon><Fries /></el-icon>
                    <template #title>我的粉丝</template>
                </el-menu-item>
            </el-menu>
        </el-col>
        <el-col :span="13" :offset="1">
            <router-view :userInfo="userInfo"/>
        </el-col>
    </el-row>
</template>

<script setup>
document.title = "社交媒体平台-个人主页";
import {reactive} from "vue";
import router from "@/router";

let userInfo = reactive(JSON.parse(localStorage.getItem("userInfo")));

function handleSelect(key) {
    // 根据 key 的值来决定跳转到哪个路由
    router.push(key);
}
</script>

<style scoped>
.titleSpan{
    display: flex;
    align-items: center;
    justify-content: center;
    height: 56px;
    font-size: 16px;
    background-color: white
}
</style>