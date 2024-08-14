<template>
    <div>
        <el-card :body-style="{ padding: 0}">
            <template #header>
                <el-row>
                    <el-col :span="2">
                        <el-button type="text" @click="$router.go(-1)">
                            <el-icon color="#000000"><Back /></el-icon>
                            <el-text color="#000000">返回</el-text>
                        </el-button>
                    </el-col>
                    <el-col :span="4" :offset="8">
                        <span>{{ isSelf ? '我的粉丝' : 'TA的粉丝' }}</span>
                    </el-col>
                </el-row>
            </template>
            <el-empty v-if="fansList.length===0" description="没有数据哦" />
            <el-card style="border: none;" shadow="never" v-for="item in fansList" :key="item.id">
                <div class="card-header">
                    <el-avatar :size="40" style="cursor: pointer;" @error="true" :src="item.pic"/>
                    <div class="info">
                        <span class="nickname">
                            {{ item.nickname }}
                            <span style="margin-left: 10px"></span>
                            <el-tooltip :content="item.sex ==='0' ? '男' : '女'" placement="bottom" effect="light">
                                <el-icon v-if="item.sex==='0'" color="#79bbff"><Male/></el-icon>
                                <el-icon v-else color="#f89898"><Female/></el-icon>
                            </el-tooltip>
                        </span>
                        <span class="time">
                            {{ "时间" }}
                        </span>
                    </div>
                    <div class="right-content">
                        <el-button color="#f89898" round plain @click="follow(item.id,item.isFollow)">
                            {{ item.isFollow ? '取消关注' : '+ 关注' }}
                        </el-button>
                    </div>
                </div>
            </el-card>
            <template #footer>
                <div class="pagination-container">
                    <el-config-provider :locale="zhCn">
                        <el-pagination v-model:current-page="pageInfo.pageNo"
                                       layout="total, prev, pager, next, jumper" :total="pageInfo.total"
                                       :page-size="pageInfo.pageSize" pager-count="6" @current-change="handleCurrentChange"/>
                    </el-config-provider>
                </div>
            </template>
        </el-card>
    </div>
</template>

<script setup>
import {onMounted, reactive, ref} from "vue";
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import request from "@/request/request";
import {ElMessage} from "element-plus";

onMounted( () => {
    getFansList()
})

const isSelf = ref(false)   // true: 查看的是本人的主页，false: 查看的是其他人的主页

let userId = ref(localStorage.getItem('id'))   // 需要查看的id

const isOpen = ref(false)
const pageInfo = ref({
    pageNo: 1,
    pageSize: 10,
    total: 0,
    userId: ''
})
// 获取关注列表
const fansList = reactive([])
async function getFansList() {
    if (JSON.parse(localStorage.getItem("userInfo")).id === userId.value) {
        isSelf.value = true
    }
    pageInfo.value.userId = userId.value
    await request.get("/concentration/get-fans",{params: pageInfo.value}).then(res => {
        fansList.length = 0;
        fansList.push(...res.data.list)
        pageInfo.value.total = parseInt(res.data.total)
        console.log("fans",res)
    })
    isOpen.value = true
}
// 关注
async function follow(id,isFollow) {
    if (isFollow) {    // 已经关注,即要取消关注
        await request.delete('/concentration/cancel', {params: {toUserId: id}}).then(res => {
            ElMessage.success("取消关注成功！")
        })
    } else {
        const concentration = reactive({toUserId: id})
        await request.post('/concentration', concentration).then(res => {
            ElMessage.success("关注成功！")
        })
    }
    // 修改该用户的isFollow
    fansList.forEach(item => {
        if (item.id === id) {
            item.isFollow = !item.isFollow
        }
    })
}
// 分页
async function handleCurrentChange(val) {
    pageInfo.value.pageNo = val;
    await getFansList()
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
    display: flex; /* 启用 Flexbox 布局 */
    align-items: center; /* 垂直居中对齐 */
    font-weight: bold;
    font-size: 16px; /* 调整字体大小 */
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
.pagination-container {
    display: flex;
    justify-content: center;
}
</style>