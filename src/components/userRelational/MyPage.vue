<template>
    <div >
        <el-card style="margin-bottom: 20px">
            <template #header>
                <div style="text-align: center">
                    <span>个人主页</span>
                </div>
            </template>
            <div class="card-header" v-if="isOpen">
                <el-tooltip v-if="isSelf" placement="bottom" effect="light" content="更换头像">
                    <el-upload action="#" :show-file-list="false" :before-upload="beforeAvatarUpload"
                               :http-request="httpRequest" accept="image/*">
                        <template #trigger>
                            <el-avatar :size="90" style="cursor: pointer;" :src="userInfo.pic" />
                        </template>
                    </el-upload>
                </el-tooltip>
                <el-avatar v-else :size="90" :src="userInfo.pic" />
                <div class="info">
                    <span class="nickname">
                        {{ userInfo.nickname }}
                        <span style="margin-left: 10px"></span>
                        <el-tooltip :content="userInfo.sex ==='0' ? '男' : '女'" placement="bottom" effect="light">
                            <el-icon v-if="userInfo.sex==='0'" color="#79bbff"><Male/></el-icon>
                            <el-icon v-else color="#f89898"><Female/></el-icon>
                        </el-tooltip>
                    </span>
                    <span class="time">
                        {{ userInfo.fansNum +'粉丝   '  }}  {{userInfo.followNum + '关注' }}
                    </span>
                </div>
                <div class="right-content">
                    <el-button v-if="!isSelf" color="#f89898" round plain>
                        {{ userInfo.isFollow ? '取消关注' : '+ 关注' }}
                    </el-button>
                </div>
            </div>
            <div>
                <el-button type="info" size="small" circle plain class="button-right" @click="openUserInfo = !openUserInfo">
                    <el-icon v-if="!openUserInfo"><ArrowDownBold /></el-icon>
                    <el-icon v-else><ArrowUpBold /></el-icon>
                </el-button>
            </div>
            <div v-if="openUserInfo">
                <el-descriptions title="用户信息" column="2">
                    <el-descriptions-item label="用户名:">{{ userInfo.username }}</el-descriptions-item>
                    <el-descriptions-item label="电话:">{{ userInfo.phone }}</el-descriptions-item>
                    <el-descriptions-item label="身份证:">{{ userInfo.idCard.replace(/^(.{4})(?:\d+)(.{4})$/,"$1******$2") }}</el-descriptions-item>
                    <el-descriptions-item>{{ /\d{4}-\d{1,2}-\d{1,2}/g.exec(userInfo.createTime)[0] + ' 加入平台'}}</el-descriptions-item>
                </el-descriptions>
                <div v-if="isSelf">
                    <el-button type="text">修改信息</el-button>
                    <el-button type="text">修改密码</el-button>
                </div>
            </div>
        </el-card>
        <treads-list v-if="isOpen" :userId="userInfo.id"/>
    </div>
</template>

<script setup>
import {onMounted, reactive, ref} from "vue";
import request from "@/request/request";
import TreadsList from "@/components/treadRelational/TreadsList.vue";
import {ArrowDownBold} from "@element-plus/icons-vue";
import {ElMessage} from "element-plus";

onMounted( () => {
    getUserInfo()
})

let userInfo = reactive({});

const isSelf = ref(false)   // true: 查看的是本人的主页，false: 查看的是其他人的主页

let userId = ref(localStorage.getItem('id'))   // 需要查看的id

const isOpen = ref(false)

const openUserInfo = ref(false)
// 获取用户信息
async function getUserInfo() {
    if (JSON.parse(localStorage.getItem("userInfo")).id === userId.value) {
        isSelf.value = true
    }
    await request.get('/user/getUserById', {params: {id: userId.value}}).then(res => {
        userInfo = res.data
    })
    isOpen.value = true
}
// 更换头像相关
function beforeAvatarUpload(file) {
    console.log("上传的文件Upload",file)
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
        ElMessage.error('只能上传图片文件!');
    }
    return isImage;
}
async function httpRequest(data) {     // 添加图片
    let formData = new FormData();
    formData.append("multipartFiles", data.file);
    await request.post('/common/images',formData).then(res => {
        userInfo.pic = res.data[0];
        ElMessage.success('上传成功!');
    })
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
    margin-top: 20px;
    display: block;
    font-size: 12px; /* 调整字体大小 */
    color: #999;
}
.right-content {
    margin-left: auto; /* 推动按钮到最右边 */
}
.button-right {
    display: flex;
    margin-left: auto;
    margin-top: 10px;
}
</style>