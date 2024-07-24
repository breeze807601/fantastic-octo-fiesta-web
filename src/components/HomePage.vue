<template>
    <div>
        <el-row>
            <el-col :span="6" :offset="1">
                <el-card>
                    hello
                </el-card>
            </el-col>
            <el-col :span="14" :offset="2">
                <edit/>
                <treads-list ></treads-list>
            </el-col>
        </el-row>
    </div>
</template>

<script setup>
import request from '@/request/request'
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import TreadsList from './TreadsList.vue'
import edit from './Edit.vue'


//测试
get()
let user = reactive({})
async function get(){
    await request.get("/user/getUser").then(res => {
        user = res.data
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