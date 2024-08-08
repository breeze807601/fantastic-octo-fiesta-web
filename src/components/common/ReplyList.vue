<template>
    <el-row>
        <el-col :span="2">
            <el-avatar :size="35" style="cursor: pointer;" @error="true" :src="comment.userPic"/>
        </el-col>
        <el-col :span="22">
            <div style="margin-bottom: 5px">
                <el-text style="margin-bottom: 5px" tag="sup" type="warning">{{comment.nickname}}</el-text>
                <div v-html="comment.content" class="font-color" style="margin-bottom: 5px;font-size: 15px"></div>
                <el-text size="small">
                    {{comment.createTime}}
                    <el-button type="text" size="small" :icon="ChatLineRound" link @click="openToReply(comment.userId,comment.nickname,comment.id)">
                        回复
                    </el-button>
                </el-text>
            </div>
            <el-row v-for="replyInfo in replyList">
                <el-col :span="2">
                    <el-avatar :size="30" style="cursor: pointer;" @error="true" :src="replyInfo.userPic"/>
                </el-col>
                <el-col :span="21">
                    <el-text style="margin-bottom: 5px" tag="sup" type="warning">{{replyInfo.nickname}} 回复 {{replyInfo.toUserNickname}}</el-text>
                    <div v-html="replyInfo.content" class="font-color" style="margin-bottom: 5px;font-size: 14px"></div>
                    <el-text size="small">
                        {{replyInfo.createTime}}
                        <el-button type="text" size="small" @click="openToReply(replyInfo.userId, replyInfo.nickname,comment.id)" :icon="ChatLineRound" link>回复</el-button>
                    </el-text>
                </el-col>
            </el-row>
        </el-col>
    </el-row>
    <div style="display: flex;justify-content: center;margin-top: 10px">
        <el-config-provider :locale="zhCn" >
            <el-pagination v-model:current-page="replyPageQuery.pageNo"
                           layout="total, prev, pager, next, jumper" :total="replyPageQuery.total" hide-on-single-page
                           :page-size="replyPageQuery.pageSize" pager-count="6"
                           @current-change="handleCurrentChange"/>
        </el-config-provider>
    </div>
</template>

<script setup>
import {defineEmits, defineProps, onMounted, reactive, ref} from "vue";
import request from "@/request/request";
import {ChatLineRound} from "@element-plus/icons-vue";
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

const props = defineProps({
    commentIf: Object,
})
const emits = defineEmits(['openReply'])

onMounted( async () => {
    await getReplyPage()
})

const comment = reactive(props.commentIf)
const replyList = reactive([])       // 回复列表
const replyPageQuery = ref({         // 回复列表查询条件
    commentId: '',
    pageNo: 1,
    pageSize: 7,
    total: 0,
})
async function getReplyPage() {   // 打开回复列表弹窗
    replyPageQuery.value.commentId = props.commentIf.id
    await request.get('/comment/reply', {params: replyPageQuery.value}).then(res => {
        replyList.length = 0
        replyList.push(...res.data.list)
        replyPageQuery.value.total = parseInt(res.data.total)
        console.log("openReplyPage",replyList)
    })
}
function openToReply(toUserId, toUserNickname, parentId) {
    // 调用Comment组件的打开弹窗方法，并将相对应的值传入，即可回复
    emits('openReply', toUserId, toUserNickname, parentId)
}
defineExpose({getReplyPage})    // 将openReplyPage暴露出去，父组件保存回复后调用
// 分页
function handleCurrentChange(val) {
    replyPageQuery.value.pageNo = val;
    getReplyPage()
}

</script>

<style scoped>
.font-color{
    color: #000000;
}
</style>