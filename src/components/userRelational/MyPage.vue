<template>
    <div >
        <el-card style="margin-bottom: 20px">
            <template #header>
                <div style="text-align: center">
                    <span>个人主页</span>
                </div>
            </template>
            <div class="card-header" v-if="isOpen">
                <el-avatar :size="90" :src="userInfo.pic" />
                <div class="info">
                    <span class="nickname">
                        {{ userInfo.nickname }}
                        <span style="margin-left: 10px"></span>
                        <el-tooltip :content="userInfo.sex ==='0' ? '男' : '女'" placement="bottom" effect="light">
                            <el-icon v-if="userInfo.sex==='0'" color="#79bbff"><Male/></el-icon>
                            <el-icon v-else color="#f89898"><Female/></el-icon>
                        </el-tooltip>
                    </span>
                    <span class="time">{{ userInfo.fansNum +'粉丝  '  +  userInfo.followNum + '关注' }}</span>
                </div>
<!--                <div class="right-content">-->
<!--                    <el-button v-if="userInfo.id !== JSON.parse(localStorage.getItem('userInfo')).id" color="#f89898" round plain-->
<!--                               @click="follow(tread.userId, tread.isFollow)">-->
<!--                        {{ tread.isFollow ? '取消关注' : '+ 关注' }}-->
<!--                    </el-button>-->
<!--                </div>-->
            </div>
        </el-card>
        <treads-list v-if="isOpen" :userId="userInfo.id"/>
    </div>
</template>

<script setup>
import router from "@/router";
import {onMounted, reactive, ref} from "vue";
import request from "@/request/request";
import TreadsList from "@/components/treadRelational/TreadsList.vue";

onMounted( () => {
    getUserInfo()
})

let userInfo = reactive({});

const isSelf = ref(false)   // true: 查看的是本人的主页，false: 查看的是其他人的主页

let userId = ref(localStorage.getItem('id'))   // 需要查看的id

const isOpen = ref(false)

async function getUserInfo() {
    if (JSON.parse(localStorage.getItem("userInfo")).id === userId.value) {
        isSelf.value = true
        // userInfo = JSON.parse(localStorage.getItem("userInfo"))
    }
    // else {
    //     await request.get('/user/getUserById', {params: {id: userId.value}}).then(res => {
    //         userInfo = res.data
    //     })
    // }
    await request.get('/user/getUserById', {params: {id: userId.value}}).then(res => {
        userInfo = res.data
    })
    // TODO 获取用户粉丝量和关注量

    console.log("userInfo",userInfo)
    isOpen.value = true
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