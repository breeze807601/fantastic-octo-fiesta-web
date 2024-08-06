<template>
    <div >
        <el-card>
            <template #header>
                <div style="text-align: center">
                    <span>个人主页</span>
                </div>
            </template>
            <div class="card-header">
                <el-avatar :size="90" :src="userInfo.pic" />
                <div class="info">
                    <span class="nickname">
                        {{ userInfo.nickname }}
                        <span style="margin-left: 10px"></span>
                        <el-tooltip :content="userInfo.sex ==='0' ? '男' : '女'" placement="bottom" effect="light">
                            <el-icon v-if="userInfo.sex==='0'"><Male/></el-icon>
                            <el-icon v-else><Female/></el-icon>
                        </el-tooltip>
                    </span>
                    <span class="time">{{ userInfo.createTime+'粉丝' }}</span>
                </div>
            </div>
        </el-card>

    </div>
</template>

<script setup>
import router from "@/router";
import {onMounted, reactive, ref} from "vue";
import request from "@/request/request";

onMounted( () => {
    getUserInfo()
})
let userInfo = reactive(JSON.parse(localStorage.getItem("userInfo")));

const isSelf = ref(false)   // true: 查看的是本人的主页，false: 查看的是其他人的主页

let userId = ref(localStorage.getItem('id'))
function getUserInfo() {
    if (userInfo.id === userId.value) {
        isSelf.value = true
        // TODO 获取用户粉丝量和关注量

    } else {
        // TODO 获取用户信息
        userInfo.id = userId.value
        userInfo.nickname = '小明'
        userInfo.pic = 'https://homework1015.oss-cn-beijing.aliyuncs.com/2024-07-25-19-50-149.png'
    }
}
async function getTreadsList(){
    await request.get('/tread/get', {params: {id: userInfo.id}}).then(res => {
        console.log("res",res)
    })
}
console.log(userInfo)
</script>

<style scoped>
.card-header {
    display: flex;
    align-items: center;
}
.info {
    margin-left: 13px;
}
.nickname {
    display: flex; /* 启用 Flexbox 布局 */
    align-items: center; /* 垂直居中对齐 */
    font-weight: bold;
    font-size: 16px; /* 调整字体大小 */
}
.time {
    margin-top: 20px;
    display: block;
    font-size: 12px; /* 调整字体大小 */
    color: #999;
}
</style>