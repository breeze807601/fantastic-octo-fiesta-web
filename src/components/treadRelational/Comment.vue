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
                                <el-button type="text" size="small" :icon="ChatLineRound" link
                                           @click="openReply(item.comment.userId, item.comment.nickname,item.comment.id)">
                                    回复
                                </el-button>
                            </el-text>
                        </div>
                        <!-- 子回复,不是详情页不显示 -->
                        <el-row v-if="item.replyPage.total > 0 && isDetails" v-for="(replyInfo, replyIndex) in item.replyPage.list">
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
                                <el-button v-if="item.replyPage.total > item.replyPage.list.length" @click="openReplyPage(item.comment)" type="text" size="small" link>
                                    共{{item.replyPage.total}}条回复 点击查看
                                </el-button>
                            </div>
                        </el-row>
                    </el-col>
                </el-row>
                <hr v-if="index !== commentList.length - 1" style="border: none; height: 1px; background-color: #e8e7e7;"/>
            </div>
        </div>
        <el-divider>
            <el-button v-if="commentPageQuery.total > commentList.length && !isDetails" type="text" size="small" link @click="toDetails()">
                <span style="font-size: 14px">共{{commentPageQuery.total}}条评论 点击查看更多</span>
            </el-button>
            <span v-else-if="!isDetails">没有更多了哦</span>
        </el-divider>
        <div v-if="total > commentList.length && isDetails" style="display: flex;justify-content: center">
            <el-config-provider :locale="zhCn">
                <el-pagination v-model:current-page="commentPageQuery.pageNo"
                               layout="total, prev, pager, next, jumper" :total="commentPageQuery.total" hide-on-single-page
                               :page-size="commentPageQuery.pageSize" pager-count="6"
                               @current-change="handleCurrentChange"/>
            </el-config-provider>
        </div>
    </div>
    <el-dialog v-model="replyDialog" title="回复" width="400" destroy-on-close :before-close="dialogClose" align-center>
        <el-input v-model="reply.content" type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" placeholder="请输入回复内容"/>
        <div style="display: flex; justify-content: center;margin-top: 10px;">
            <el-button type="primary" @click="saveReply()">回复</el-button>
        </div>
    </el-dialog>
    <el-dialog v-model="replyInfoDialog" title="回复列表" width="600" destroy-on-close>
        <reply-list ref="newPage" :commentIf="commentIf" @openReply="openReply"/>
    </el-dialog>
</template>

<script setup>

import {ref, reactive, defineProps, onMounted} from "vue";
import request from "@/request/request";
import {ChatLineRound} from "@element-plus/icons-vue"
import {ElMessage, ElMessageBox } from "element-plus";
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import router from "@/router";
import ReplyList from "@/components/common/ReplyList.vue";

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
// 评论相关
const commentList = reactive([])   // 评论列表

const comment = reactive({       // 评论info，用于保存评论
    treadsId: props.treadId,
    content: '',
    toUserId: props.toUserId,
    toUserNickname: props.toUserNickname,
})
const commentPageQuery = ref({         // 评论查询条件
    treadsId: props.treadId,
    pageNo: 1,
    pageSize: props.isDetails ? 10 : 3,
    replyPageNo: 1,
    replyPageSize: props.isDetails ? 4 : 0,  // 不是详情页不查询
    total: 0,   // 评论条数
})
async function saveComment(){          // 保存评论
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
        commentPageQuery.value.total += 1;
        // 如果每页数量小于评论列表数量，则删除多余的评论
        if (commentPageQuery.value.pageSize < commentPageQuery.value.total) {
            commentList.splice(commentPageQuery.value.pageSize, commentList.length - commentPageQuery.value.pageSize);
        }
        ElMessage.success("发送成功！")
    })
}
async function getCommentList(){       // 获取评论列表
    await request.get('/comment', {params: commentPageQuery.value}).then(res => {
        commentList.length = 0;
        commentList.push(...res.data.list)
        commentPageQuery.value.total = parseInt(res.data.total)       // 转换成数字
    })
}

// 回复相关
const reply = reactive({     // 回复info，用于保存
    toUserId: '',
    toUserNickname: '',
    content: '',
    parentId: ''
})
const replyDialog = ref(false) // 回复弹窗
function openReply(toUserId, toUserNickname,parentId){   // 打开回复弹窗并赋值reply的info，方便保存
    reply.toUserId = toUserId;
    reply.toUserNickname = toUserNickname;
    reply.parentId = parentId;
    replyDialog.value = true
}
function dialogClose() {      // 关闭回复弹窗，清空reply的info
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
const newPage = ref(null)
async function saveReply() {         // 保存回复
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
        // 子组件ref='newPage'，然后父组件调用子组件暴露的openReplyPage方法
        newPage.value.getReplyPage()
    })
}
// 查看回复列表弹窗
const replyInfoDialog = ref(false)    // 回复列表弹窗
let commentIf = reactive({})  // 回复弹窗的主评论
async function openReplyPage(comment) {   // 打开回复列表弹窗
    commentIf = comment;
    replyInfoDialog.value = true
}

// 主评论分页
async function handleCurrentChange(val) {
    commentPageQuery.value.pageNo = val;
    await getCommentList()
}
async function moreComment(){
    if (props.isDetails) {
        commentPageQuery.value.pageNo++;
        await getCommentList()
    } else {
        toDetails(props.treadId)
    }
}
// 跳转详情页
function toDetails(){
    router.push({
        path: '/details',
        query: {
            id: props.treadId,
        }
    })
}
</script>

<style>

</style>