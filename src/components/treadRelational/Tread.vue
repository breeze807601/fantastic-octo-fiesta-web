<template>
    <el-card class="tread-card"  shadow="never" style="margin-bottom: 10px">
        <template #header>
            <div class="card-header">
                <el-avatar :size="40" style="cursor: pointer;" @error="true" :src="tread.pic" @click="toWebpage(tread.userId)"/>
                <div class="info">
                    <span class="nickname">{{ tread.nickName }}</span>
                    <span class="time">{{ tread.createTime }}</span>
                </div>
                <div class="right-content" v-if="!isUserIdDefined">
                    <el-button v-if="userInfo.id !== tread.userId" color="#f89898" round plain
                               @click="follow(tread.userId, tread.isFollow)">
                        {{ tread.isFollow ? '取消关注' : '+ 关注' }}
                    </el-button>
                </div>
            </div>
        </template>
        <div>
            <el-text v-if="open" size="large" line-clamp="5">
                <div v-html="tread.content"></div>
            </el-text>
            <el-text v-else size="large">
                <div v-html="tread.content"></div>
            </el-text>
            <div v-if="tread.imageList.length > 0">
                <el-image v-for="image in tread.imageList" :src="image.url" :key="image.id"
                          @click="showView(tread.imageList,image.id)" style="width: 100px; height: 100px;margin-left: 70px" fit="scale-down" />
            </div>
            <el-divider border-style="dashed" />
        </div>
        <div>
            <el-text line-clamp="3">
                标签 :<el-tag v-for="index in tread.tagList" :key="index" type="success">{{ index.name }}</el-tag>
            </el-text>
        </div>
        <div style="display: flex;justify-content: space-between;">
            <el-button type="text" v-if="open" @click="toDetails(tread.id)"><el-icon><View /></el-icon>详情</el-button>
            <el-button type="text" v-if="open" @click="isOpen = !isOpen"><el-icon><ChatDotSquare /></el-icon>评论</el-button>
            <el-button type="text" @click="support(tread.id, tread.isSupport)">
                <svg v-if="tread.isSupport" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
                    <path d="M885.9 533.7c16.8-22.2 26.1-49.4 26.1-77.7 0-44.9-25.1-87.4-65.5-111.1a67.67 67.67 0 0 0-34.3-9.3H572.4l6-122.9c1.4-29.7-9.1-57.9-29.5-79.4-20.5-21.5-48.1-33.4-77.9-33.4-52 0-98 35-111.8 85.1l-85.9 311H144c-17.7 0-32 14.3-32 32v364c0 17.7 14.3 32 32 32h601.3c9.2 0 18.2-1.8 26.5-5.4 47.6-20.3 78.3-66.8 78.3-118.4 0-12.6-1.8-25-5.4-37 16.8-22.2 26.1-49.4 26.1-77.7 0-12.6-1.8-25-5.4-37 16.8-22.2 26.1-49.4 26.1-77.7-0.2-12.6-2-25.1-5.6-37.1zM184 852V568h81v284h-81z m636.4-353l-21.9 19 13.9 25.4c4.6 8.4 6.9 17.6 6.9 27.3 0 16.5-7.2 32.2-19.6 43l-21.9 19 13.9 25.4c4.6 8.4 6.9 17.6 6.9 27.3 0 16.5-7.2 32.2-19.6 43l-21.9 19 13.9 25.4c4.6 8.4 6.9 17.6 6.9 27.3 0 22.4-13.2 42.6-33.6 51.8H329V564.8l99.5-360.5c5.2-18.9 22.5-32.2 42.2-32.3 7.6 0 15.1 2.2 21.1 6.7 9.9 7.4 15.2 18.6 14.6 30.5l-9.6 198.4h314.4C829 418.5 840 436.9 840 456c0 16.5-7.2 32.1-19.6 43z" fill="#d81e06">
                    </path>
                </svg>
                <svg v-else viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
                    <path d="M885.9 533.7c16.8-22.2 26.1-49.4 26.1-77.7 0-44.9-25.1-87.4-65.5-111.1a67.67 67.67 0 0 0-34.3-9.3H572.4l6-122.9c1.4-29.7-9.1-57.9-29.5-79.4-20.5-21.5-48.1-33.4-77.9-33.4-52 0-98 35-111.8 85.1l-85.9 311H144c-17.7 0-32 14.3-32 32v364c0 17.7 14.3 32 32 32h601.3c9.2 0 18.2-1.8 26.5-5.4 47.6-20.3 78.3-66.8 78.3-118.4 0-12.6-1.8-25-5.4-37 16.8-22.2 26.1-49.4 26.1-77.7 0-12.6-1.8-25-5.4-37 16.8-22.2 26.1-49.4 26.1-77.7-0.2-12.6-2-25.1-5.6-37.1zM184 852V568h81v284h-81z m636.4-353l-21.9 19 13.9 25.4c4.6 8.4 6.9 17.6 6.9 27.3 0 16.5-7.2 32.2-19.6 43l-21.9 19 13.9 25.4c4.6 8.4 6.9 17.6 6.9 27.3 0 16.5-7.2 32.2-19.6 43l-21.9 19 13.9 25.4c4.6 8.4 6.9 17.6 6.9 27.3 0 22.4-13.2 42.6-33.6 51.8H329V564.8l99.5-360.5c5.2-18.9 22.5-32.2 42.2-32.3 7.6 0 15.1 2.2 21.1 6.7 9.9 7.4 15.2 18.6 14.6 30.5l-9.6 198.4h314.4C829 418.5 840 436.9 840 456c0 16.5-7.2 32.1-19.6 43z" fill="#1296db">
                    </path>
                </svg>
                {{ tread.supportNum }}
            </el-button>
        </div>
        <div v-if="isOpen">
            <el-divider border-style="dashed" />
            <comment v-bind="{treadId: tread.id,toUserId: tread.userId,toUserNickname: tread.nickName,isDetails: false}"></comment>
        </div>
    </el-card>
    <el-image-viewer @close="showViewer = false" v-if="showViewer" :url-list="previewList" :initialIndex="num"/>
</template>

<script setup>

import { ref, reactive, defineProps, defineEmits} from "vue";
import Comment from "@/components/treadRelational/Comment.vue";
import {ElMessage} from "element-plus";
import request from "@/request/request";
import router from "@/router";

let userInfo = reactive(JSON.parse(localStorage.getItem("userInfo")))

const props = defineProps({
    tread: Object,
    open: Boolean,
    isUserIdDefined: Boolean,
})

const isOpen = ref(false)

// 预览图片
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

// 关注
const emits = defineEmits(['modFollow'])
async function follow(toUserId,isFollow) {
    if (isFollow) {          // 取消关注
        await request.delete('/concentration/cancel', {params: {toUserId: toUserId}}).then(res => {
            ElMessage.success("取消关注成功！")
        })
    } else {          // 关注用户
        const concentration = reactive({toUserId: toUserId,})
        await request.post('/concentration', concentration).then(res => {
            ElMessage.success("关注成功！")
        })
    }
    emits('modFollow',toUserId,isFollow)  // 调用父组件的方法，修改前端关注按钮表现
}
// 点赞
async function support(id,isSupport) {
    const support = {
        treadsId: id,
        userId: userInfo.id
    }
    if (!isSupport) {  // 正在点赞
        await request.post('/tread/support', support).then(res => {
            console.log(res);
            props.tread.isSupport = true;
            props.tread.supportNum++;
            ElMessage.success('点赞成功！');
        })
    } else {
        await request.post('/tread/cancel',support).then(res => {
            console.log(res);
            props.tread.isSupport = false;
            props.tread.supportNum--;
            ElMessage.success('取消点赞成功！');
        })
    }

}
function toDetails(treadId){
    router.push({
        path: '/details',
        query: {
            id: treadId,
        }
    })
}
function toWebpage(userId){
    localStorage.setItem("id",userId)
    router.push('/webpage')
}
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
    display: block;
    font-weight: bold;
    font-size: 14px; /* 调整字体大小 */
}
.time {
    margin-top: 5px;
    display: block;
    font-size: 12px; /* 调整字体大小 */
    color: #999;
}
.right-content {
    margin-left: auto; /* 推动按钮到最右边 */
}
.el-tag{
    margin-left: 5px;
    margin-bottom: 5px;
}
</style>