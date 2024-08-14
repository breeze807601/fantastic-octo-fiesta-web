<template>
    <el-row>
        <el-col :span="4" :offset="5">
            <el-menu @select="handleSelect">
                <div class="titleSpan">
                    <span>个人主页</span>
                </div>
                <el-menu-item index="/myPage">
                    <el-icon><user /></el-icon>
                    <template #title>{{ isSelf ? "我的主页" : "TA的主页" }}</template>
                </el-menu-item>
                <el-menu-item index="/myAttention">
                    <el-icon><Star /></el-icon>
                    <template #title>{{ isSelf ? "我的关注" : "TA的关注" }}</template>
                </el-menu-item>
                <el-menu-item index="/myFans">
                    <el-icon><Fries /></el-icon>
                    <template #title>{{ isSelf ? "我的粉丝" : "TA的粉丝" }}</template>
                </el-menu-item>
            </el-menu>
        </el-col>
        <el-col :span="13" :offset="1">
            <router-view/>
        </el-col>
    </el-row>
</template>

<script setup>
document.title = "社交媒体平台-个人主页";
import router from "@/router";
import {onMounted, ref} from "vue";

onMounted( () => {
    isMe()
})
const isSelf = ref(false)   // true: 查看的是本人的主页，false: 查看的是其他人的主页
let userId = ref(localStorage.getItem('id'))   // 需要查看的id

async function isMe() {
    if (JSON.parse(localStorage.getItem("userInfo")).id === userId.value) {
        isSelf.value = true
    }
}

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