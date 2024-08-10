<template>
    <!--  编辑要不是个人主页才出现  -->
    <edit v-if="!isUserIdDefined"/>
    <div :infinite-scroll-disabled="disabled" v-infinite-scroll="addList">
        <tread v-for="tread in treadList" :key="tread.id" :tread="tread" :isUserIdDefined="isUserIdDefined" :open="true" @modFollow="modFollow"/>
    </div>
    <el-divider v-if="loading">
        <el-icon class="is-loading"><Loading /></el-icon>正在加载更多数据...
    </el-divider>
    <el-divider v-if="noMore">
        已经到底了哟
    </el-divider>
</template>

<script setup>
import request from "@/request/request";
import {computed, onMounted, reactive, ref} from "vue";
import tread from "@/components/treadRelational/Tread.vue";
import edit from "@/components/treadRelational/Edit.vue"

let userInfo = reactive(JSON.parse(localStorage.getItem("userInfo")))

const props = defineProps({
    userId: String,
})

const isUserIdDefined = computed(() => typeof props.userId !== 'undefined' && props.userId.trim() !== '')   // 判断userId是否有参数

// 搜索
window.addEventListener('search',function (e) {
    pageInfo.value.pageNo = 1;
    treadList.splice(0, treadList.length);
    if (e.detail === '') {
        pageInfo.value.key = '';
    } else {
        pageInfo.value.key = e.detail;
    }
    getList();
})

// 获取列表
const loading = ref(false);  // 加载动画
const noMore = computed(() => treadList.length >= pageInfo.value.total)   // 没有更多数据
const disabled = computed(() => loading.value || noMore.value)

const treadList = reactive([])
const pageInfo = ref({
    pageNo: 1,
    pageSize: 2,
    total: 0,
    key: '',
    userId: isUserIdDefined.value ? props.userId : ''
})
onMounted(async () => {
    await getList();
});
async function getList(){
    if (isUserIdDefined.value) {
        await request.get('/tread/getByUser', {params: pageInfo.value}).then(res => {
            treadList.push(...res.data.list);
            pageInfo.value.total = res.data.total;
        })
    }else {
        await request.get('/tread/page', {params: pageInfo.value}).then(res => {
            treadList.push(...res.data.list);
            pageInfo.value.total = res.data.total;
        })
    }
}
function addList(){
    if (!noMore.value && !loading.value) {     // 只有当还有更多数据时才加载
        loading.value = true;
        setTimeout(() => {
            pageInfo.value.pageNo += 1;
            getList()
            loading.value = false; // 确保在请求完成后关闭加载动画
        }, 1000);
    }
}
// 修改关注状态
function modFollow(toUserId,isFollow){
    for (let i=0;i<treadList.length;i++) {
        if (treadList[i].userId === toUserId) {
            treadList[i].isFollow = !isFollow;
        }
    }
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