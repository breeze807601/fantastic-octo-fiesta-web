<template>
    <div>
        <!--  评论头部   -->
        <el-row :gutter="22" style="display: flex; align-items: center;">
            <el-col :span="2">
                <el-avatar :size="40" style="cursor: pointer;" @error="true" :src="userInfo.pic"/>
            </el-col>
            <el-col :span="19">
                <el-input type="textarea" v-model="comment" placeholder="请输入内容"/>
            </el-col>
            <el-col :span="1">
                <el-button type="primary" @click="console.log('comment',comment)">评论</el-button>
            </el-col>
        </el-row>
        <!--  评论数据  -->

    </div>
</template>

<script setup>

import { ref, reactive} from "vue";

let userInfo = reactive(JSON.parse(localStorage.getItem("userInfo")))

const comment = ref('')
</script>

<style>

</style>