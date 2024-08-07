<template>
    <div class="details">
        <div style="background-color: white">
            <el-row>
                <el-col :span="6">
                    <el-button style="margin-bottom: 10px;margin-top: 10px" text="text"
                               @click="router.go(-1)">
                        <el-icon><Back /></el-icon> 返回
                    </el-button>
                </el-col>
            </el-row>
        </div>
        <!-- 先获取到tread，再打开，否则传值错误 -->
        <div v-if="open">
            <Tread v-bind="{tread: tread,open: false}"></Tread>
            <el-card>
                <comment v-bind="{treadId: tread.id,toUserId: tread.userId,toUserNickname: tread.nickName,isDetails: true}"></comment>
            </el-card>
        </div>
    </div>
</template>

<script setup>
import {ElLoading} from "element-plus";

document.title = "社交媒体平台-动态详情";
import {onMounted, reactive, ref} from 'vue'
import router from "@/router";
import request from "@/request/request";
import Tread from "@/components/treadRelational/Tread.vue";
// 滚动到顶部
window.scrollTo(0, 0);

let userInfo = reactive(JSON.parse(localStorage.getItem("userInfo")));

// 获取动态
import { useRoute } from 'vue-router';
import Comment from "@/components/treadRelational/Comment.vue";
const route = useRoute();

onMounted(async () => {
    await getTread();
});
const tread = ref({})

const open = ref(false)
async function getTread(){
    const loading = ElLoading.service({
        lock: true,
        text: '加载中',
        background: 'rgba(0, 0, 0, 0.7)',
    })
    await request.get('/tread/get',{params:{id: route.query.id}}).then(res => {
        tread.value = res.data;
        loading.close();
        open.value = true;
    })
}

</script>

<style scoped>
.header {
    height: 80px;
    background-color: white;
    padding: 0 !important;
    border-bottom: 1px solid #dcdfe6;
    position: sticky;
    top: 0;
    width: 100%;
    z-index: 1000;
}
</style>