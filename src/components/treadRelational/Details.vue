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
        <el-card shadow="never" style="margin-bottom: 10px">
            <template #header>
                <div class="card-header">
                    <el-avatar :size="35" style="cursor: pointer;" @error="true">
                        <img :src="tread.pic" />
                    </el-avatar>
                    <div class="info">
                        <span class="nickname">{{ tread.nickname }}</span>
                        <span class="time">{{tread.createTime}}</span>
                    </div>
                    <div class="right-content">
                        <el-button v-if="userInfo.id !== tread.userId" color="#f89898" round plain>{{ tread.isFollow ? '已关注' : '+ 关注' }}</el-button>
                    </div>
                </div>
            </template>
            <div>
                <div v-html="tread.content"></div>
                <div v-if="tread.imageList !==  0">
                    <el-image v-for="image in tread.imageList" :src="image.url" :key="image.id"
                              @click="showView(tread.imageList,image.id)" style="width: 100px; height: 100px;margin-left: 70px" fit="scale-down" />
                </div>
                <el-divider border-style="dashed" />
            </div>
            <div>
                <el-text >
                    标签 :<el-tag v-for="index in tread.tagList" :key="index" type="success">{{ index.name }}</el-tag>
                </el-text>
            </div>
            <div style="display: flex;justify-content: space-between;">
                <el-button type="text"><el-icon><ChatDotSquare /></el-icon>评论</el-button>
                <el-button type="text" @click="icon = !icon">
                    <svg v-if="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
                        <path d="M885.9 533.7c16.8-22.2 26.1-49.4 26.1-77.7 0-44.9-25.1-87.4-65.5-111.1a67.67 67.67 0 0 0-34.3-9.3H572.4l6-122.9c1.4-29.7-9.1-57.9-29.5-79.4-20.5-21.5-48.1-33.4-77.9-33.4-52 0-98 35-111.8 85.1l-85.9 311H144c-17.7 0-32 14.3-32 32v364c0 17.7 14.3 32 32 32h601.3c9.2 0 18.2-1.8 26.5-5.4 47.6-20.3 78.3-66.8 78.3-118.4 0-12.6-1.8-25-5.4-37 16.8-22.2 26.1-49.4 26.1-77.7 0-12.6-1.8-25-5.4-37 16.8-22.2 26.1-49.4 26.1-77.7-0.2-12.6-2-25.1-5.6-37.1zM184 852V568h81v284h-81z m636.4-353l-21.9 19 13.9 25.4c4.6 8.4 6.9 17.6 6.9 27.3 0 16.5-7.2 32.2-19.6 43l-21.9 19 13.9 25.4c4.6 8.4 6.9 17.6 6.9 27.3 0 16.5-7.2 32.2-19.6 43l-21.9 19 13.9 25.4c4.6 8.4 6.9 17.6 6.9 27.3 0 22.4-13.2 42.6-33.6 51.8H329V564.8l99.5-360.5c5.2-18.9 22.5-32.2 42.2-32.3 7.6 0 15.1 2.2 21.1 6.7 9.9 7.4 15.2 18.6 14.6 30.5l-9.6 198.4h314.4C829 418.5 840 436.9 840 456c0 16.5-7.2 32.1-19.6 43z" fill="#1296db">
                        </path>
                    </svg>
                    <svg v-else viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
                        <path d="M885.9 533.7c16.8-22.2 26.1-49.4 26.1-77.7 0-44.9-25.1-87.4-65.5-111.1a67.67 67.67 0 0 0-34.3-9.3H572.4l6-122.9c1.4-29.7-9.1-57.9-29.5-79.4-20.5-21.5-48.1-33.4-77.9-33.4-52 0-98 35-111.8 85.1l-85.9 311H144c-17.7 0-32 14.3-32 32v364c0 17.7 14.3 32 32 32h601.3c9.2 0 18.2-1.8 26.5-5.4 47.6-20.3 78.3-66.8 78.3-118.4 0-12.6-1.8-25-5.4-37 16.8-22.2 26.1-49.4 26.1-77.7 0-12.6-1.8-25-5.4-37 16.8-22.2 26.1-49.4 26.1-77.7-0.2-12.6-2-25.1-5.6-37.1zM184 852V568h81v284h-81z m636.4-353l-21.9 19 13.9 25.4c4.6 8.4 6.9 17.6 6.9 27.3 0 16.5-7.2 32.2-19.6 43l-21.9 19 13.9 25.4c4.6 8.4 6.9 17.6 6.9 27.3 0 16.5-7.2 32.2-19.6 43l-21.9 19 13.9 25.4c4.6 8.4 6.9 17.6 6.9 27.3 0 22.4-13.2 42.6-33.6 51.8H329V564.8l99.5-360.5c5.2-18.9 22.5-32.2 42.2-32.3 7.6 0 15.1 2.2 21.1 6.7 9.9 7.4 15.2 18.6 14.6 30.5l-9.6 198.4h314.4C829 418.5 840 436.9 840 456c0 16.5-7.2 32.1-19.6 43z" fill="#d81e06">
                        </path>
                    </svg>
                </el-button>
            </div>
        </el-card>
    </div>
    <el-image-viewer @close="showViewer = false" v-if="showViewer" :url-list="previewList" :initialIndex="num"/>
</template>

<script setup>
import {ElLoading} from "element-plus";

document.title = "社交媒体平台-动态详情";
import {onMounted, reactive, ref} from 'vue'
import router from "@/router";
import request from "@/request/request";
// 滚动到顶部
window.scrollTo(0, 0);

let userInfo = reactive(JSON.parse(localStorage.getItem("userInfo")));

// 获取动态
import { useRoute } from 'vue-router';
const route = useRoute();


onMounted(async () => {
    await getTread();
});
const tread = ref({})
async function getTread(){
    const loading = ElLoading.service({
        lock: true,
        text: '加载中',
        background: 'rgba(0, 0, 0, 0.7)',
    })
    await request.get('/tread/get',{params:{id: route.query.id}}).then(res => {
        tread.value = res.data;
        loading.close();
    })
}

// 图片预览
const num = ref(0)  // 第一个预览图片的下标
const showViewer = ref(false)  //预览弹窗
const previewList = reactive([])  // 预览图片数组
function showView(list,id){
    previewList.length = 0;
    for (let i=0;i<list.length;i++) {
        previewList.push(list[i].url);
        // 通过id获取用户点击的图片数组下标
        if (list[i].id === id){
            // 赋值给num，el-image-viewer从该图片开始预览
            num.value = i;
        }
    }
    showViewer.value = true;
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