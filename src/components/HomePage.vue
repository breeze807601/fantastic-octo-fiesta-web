<template>
    <div>
        <el-row>
            <el-col :span="6" :offset="1">
                <el-card>
                    hello
                </el-card>
            </el-col>
            <el-col :span="14" :offset="2">
                <el-card style="margin-bottom: 20px">

                    <el-input v-model="textarea" style="width: 100%" :rows="3" type="textarea" placeholder="有什么新鲜事想分享给大家"/>
                </el-card>
                <treads-list ></treads-list>
            </el-col>

        </el-row>
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