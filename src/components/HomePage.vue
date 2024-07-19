<template>
    <div>
        <el-card style="margin-bottom: 20px">
            发动态
        </el-card>
        <treads-list ></treads-list>
        <!-- <el-row>
            <el-col :span="9" :offset="6">
                <treads-list ></treads-list>
            </el-col>
        </el-row> -->
    </div>
</template>

<script setup>
import request from '@/request/request'
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import TreadsList from './TreadsList.vue'


//测试
get()
const user = reactive({})
async function get(){
    await request.get("/user/getUser").then(res => {
        Object.assign(user, res.data)
        // console.log('user',user[0].id);
    }).catch(err => {
        ElMessage({
            message: err.msg ? err.msg : "失败！",
            type: 'error',
        })
    })

}
</script>

<style>
</style>