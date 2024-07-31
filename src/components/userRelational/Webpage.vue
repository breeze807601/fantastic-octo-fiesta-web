<template>
    <el-row>
        <el-col :span="4" :offset="3">
            <el-menu :default-active="activeIndex" >
                <div  style="display: flex; align-items: center; justify-content: center; height: 56px; font-size: 16px;">
                    <span>个人主页</span>
                </div>
                <el-menu-item index="1">
                    <el-icon><user /></el-icon>
                    <template #title>我的主页</template>
                </el-menu-item>
                <el-menu-item index="2">
                    <el-icon><Star /></el-icon>
                    <template #title>我的关注</template>
                </el-menu-item>
                <el-menu-item index="3">
                    <el-icon><Fries /></el-icon>
                    <template #title>我的粉丝</template>
                </el-menu-item>
            </el-menu>
        </el-col>
        <el-col :span="13" :offset="3">
            <el-card>
                <el-link :underline="false">
                    <el-icon><ArrowLeftBold /></el-icon>返回
                </el-link>
                <div>
                    <el-avatar :size="60" :src="circleUrl" />
                </div>
            </el-card>
        </el-col>
    </el-row>

</template>

<script setup>
import {ref} from "vue";

const activeIndex = ref('1')
</script>

<style scoped>

</style>