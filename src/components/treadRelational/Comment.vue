<template>
    <div>
        <!--  评论头部   -->
        <el-row :gutter="22" style="display: flex; align-items: center;">
            <el-col :span="2">
                <el-avatar :size="40" style="cursor: pointer;" @error="true" :src="userInfo.pic"/>
            </el-col>
            <el-col :span="19">
                <el-input type="textarea" v-model="comment.content" :autosize="{ minRows: 2, maxRows: 4 }" placeholder="请输入内容"/>
            </el-col>
            <el-col :span="1">
                <el-button type="primary" @click="saveComment()">评论</el-button>
            </el-col>
        </el-row>
        <el-divider/>
        <!--  评论数据  -->
        <div v-if="commentList.length > 0">
            <div v-for="(item, index) in commentList" :key="index">
                <el-row>
                    <el-col :span="2">
                        <el-avatar :size="35" style="cursor: pointer;" @error="true" :src="item.comment.userPic"/>
                    </el-col>
                    <el-col :span="21">
                        <div style="margin-bottom: 5px">
                            <el-text style="margin-bottom: 5px" tag="sup">{{item.comment.nickname}}</el-text>
                            <div v-html="item.comment.content" style="margin-bottom: 5px;font-size: 15px"></div>
                            <el-text size="small">
                                {{item.comment.createTime}}
                                <el-button type="text" size="small" @click="openReply(item.comment.userId, item.comment.nickname,item.comment.id)" :icon="ChatLineRound" link>
                                    回复
                                </el-button>
                            </el-text>
                        </div>
                        <!-- 子回复 -->
                        <el-row v-if="item.replyPage.total > 0" v-for="(replyInfo, replyIndex) in item.replyPage.list">
                            <el-col :span="2">
                                <el-avatar :size="30" style="cursor: pointer;" @error="true" :src="replyInfo.userPic"/>
                            </el-col>
                            <el-col :span="21">
                                <el-text style="margin-bottom: 5px" tag="sup">{{replyInfo.nickname}} 回复 {{replyInfo.toUserNickname}}</el-text>
                                <div v-html="replyInfo.content" style="margin-bottom: 5px;font-size: 14px"></div>
                                <el-text size="small">
                                    {{replyInfo.createTime}}
                                    <el-button type="text" size="small" @click="openReply(replyInfo.userId, replyInfo.nickname,item.comment.id)" :icon="ChatLineRound" link>回复</el-button>
                                </el-text>

                            </el-col>
                            <div style="margin-bottom: 5px" v-if="replyIndex === item.replyPage.list.length - 1">
                                <el-button v-if="item.replyPage.total > item.replyPage.list.length && !pagination" @click="pagination=!pagination;moreReplyPage" type="text" size="small" link>
                                    共{{item.replyPage.total}}条回复 点击查看
                                </el-button>
                                <el-pagination  v-model:current-page="currentPage1"
                                    size="small"
                                    layout="prev, pager, next"
                                    :total="item.replyPage.total"
                                />
                            </div>
                        </el-row>
                    </el-col>
                </el-row>
                <hr v-if="index !== commentList.length - 1" style="border: none; height: 1px; background-color: #e8e7e7;"/>
            </div>
        </div>
        <el-divider>
            <el-button v-if="total > commentList.length && !isDetails" type="text" size="small" link @click="moreComment()">
                <span style="font-size: 14px">共{{total}}条评论 点击查看更多</span>
            </el-button>
<!--            <el-pagination v-model:current-page="currentPage1" layout="prev, pager, next" :total="item.replyPage.total"/>-->
            <span v-else>没有更多了哦</span>
        </el-divider>
    </div>
    <el-dialog v-model="replyDialog" title="回复" width="400" destroy-on-close :before-close="dialogClose" align-center>
        <el-input v-model="reply.content" type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" placeholder="请输入回复内容"/>
        <div style="display: flex; justify-content: center;margin-top: 10px;">
            <el-button type="primary" @click="saveReply()">回复</el-button>
        </div>
    </el-dialog>
</template>

<script setup>

import {ref, reactive, defineProps, onMounted} from "vue";
import request from "@/request/request";
import {ChatLineRound} from "@element-plus/icons-vue"
import {ElMessage, ElMessageBox} from "element-plus";
import router from "@/router";

let userInfo = reactive(JSON.parse(localStorage.getItem("userInfo")))

const props = defineProps({
    treadId: String,
    toUserId: String,
    toUserNickname: String,
    isDetails: Boolean
})

onMounted( async () => {
    await getCommentList()
})
// 评论回复列表数据
const commentList = reactive([])
const total = ref()
// 评论传参
const comment = reactive({
    treadsId: props.treadId,
    content: '',
    toUserId: '',
    toUserNickname: '',
    parentId: ''
})
// 评论查询
const commentPageQuery = ref({
    treadsId: props.treadId,
    pageNo: 1,
    pageSize: props.isDetails ? 10 : 5,
})
const replyPageQuery = ref({
    commentId: '',
    pageNo: 1,
    pageSize: props.isDetails ? 10 : 5,
})
// 评论保存
async function saveComment(){
    comment.toUserId = props.toUserId;
    comment.toUserNickname = props.toUserNickname;
    await request.post('/comment/save',comment).then(res => {
        comment.content = '';
        const newCommentEntry = {
            comment: res.data,
            replyPage: {
                pages: 0,
                total: 0,
                list: []
            }
        };
        // 时间排列，所以添加到数组的开头
        commentList.unshift(newCommentEntry);
        if (!props.isDetails) {
            commentList.splice(3, commentList.length - 3);
        }
        // 清空toUserId和toUserNickname，因为回复也会用到comment
        comment.toUserId = '';
        comment.toUserNickname = '';
        ElMessage.success("发送成功！")
    })
}

// 回复相关
const reply = reactive({
    toUserId: '',
    toUserNickname: '',
    content: '',
    parentId: ''
})
const replyDialog = ref(false) // 回复弹窗
function openReply(toUserId, toUserNickname,parentId){   // 打开回复弹窗并赋值comment的info
    reply.toUserId = toUserId;
    reply.toUserNickname = toUserNickname;
    reply.parentId = parentId;
    replyDialog.value = true
}
function dialogClose() {
    ElMessageBox.confirm(
        '关闭回复窗口将不会保存编辑内容，确定关闭吗？',
        '提示',
        {confirmButtonText: '确定',cancelButtonText: '取消',type: 'warning',}
    ).then(() => {
        reply.toUserId = '';
        reply.toUserNickname = '';
        reply.parentId = '';
        reply.content = '';
        replyDialog.value = false
    })
}
async function saveReply() {
    await request.post('/comment/save',reply).then(res => {
        for (let i = 0; i < commentList.length; i++) {
            if (commentList[i].comment.id === reply.parentId) {
                commentList[i].replyPage.list.unshift(res.data);
                commentList[i].replyPage.total++;
            }
        }
        reply.content = '';
        reply.toUserId = '';
        reply.toUserNickname = '';
        reply.parentId = '';
        reply.content = '';
        replyDialog.value = false;
        ElMessage.success("回复成功！")
    })
}
async function getCommentList(){
    await request.get('/comment', {params: commentPageQuery.value}).then(res => {
        commentList.push(...res.data.list)
        if (!props.isDetails) {
            commentList.splice(3, commentList.length - 3);
        }
        total.value = res.data.total
        console.log("commentList",commentList)
    })
}
async function moreComment(){
    if (props.isDetails) {
        commentPageQuery.value.pageNo++;
        await getCommentList()
    } else {
        toDetails(props.treadId)
    }
}
async function moreReplyPage() {
    if (props.isDetails) {

    }
}
// 分页
const pagination = ref(false)
// 跳转详情页
function toDetails(treadId){
    router.push({
        path: '/details',
        query: {
            id: treadId,
        }
    })
}
</script>

<style>

</style>