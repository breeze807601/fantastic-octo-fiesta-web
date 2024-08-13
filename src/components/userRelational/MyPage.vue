<template>
    <div >
        <el-card style="margin-bottom: 20px">
            <template #header>
                <el-row>
                    <el-col :span="2">
                        <el-button type="text" @click="$router.go(-1)">
                            <el-icon color="#000000"><Back /></el-icon>
                            <el-text color="#000000">返回</el-text>
                        </el-button>
                    </el-col>
                    <el-col :span="4" :offset="8">
                        <span>个人主页</span>
                    </el-col>
                </el-row>
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
                <div v-if="isSelf" style="display: flex;justify-content: flex-end;">
                    <el-button type="text" @click="modDialog = true">修改信息</el-button>
                    <el-button type="text" @click="user.password='';user.pw='';modForm = true;modDialog = true">修改密码</el-button>
                </div>
            </div>
        </el-card>
        <div >
            <el-text style="margin-bottom: 10px">全部动态</el-text>
        </div>
        <treads-list v-if="isOpen" :userId="userInfo.id"/>
    </div>
    <el-dialog v-model="modDialog" title="修改信息" width="30%" center destroy-on-close :before-close="beforeClose">
        <el-form v-if="!modForm" :rules="rules" :model="user" label-width="auto" size="large" ref="registerFormRef">
            <el-form-item prop="username" label="用户名">
                <el-input v-model="user.username" placeholder="请输入用户名" :prefix-icon="User" />
            </el-form-item>
            <el-form-item prop="nickname" label="昵&emsp;称">
                <el-input v-model="user.nickname" :prefix-icon="Grape" placeholder="请输入昵称"/>
            </el-form-item>
            <el-form-item prop="phone" label="电&emsp;话">
                <el-input v-model="user.phone" placeholder="请输入电话" :prefix-icon="Iphone" />
            </el-form-item>
            <el-form-item prop="idCard" label="身份证">
                <el-input v-model="user.idCard" placeholder="请输入身份证号码" :prefix-icon="CreditCard" />
            </el-form-item>
            <el-form-item label="性&emsp;别">
                <el-radio-group v-model="user.sex">
                    <el-radio value="0" size="large">男</el-radio>
                    <el-radio value="1" size="large">女</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <el-form v-else :rules="rules" :model="user" label-width="auto" size="large" ref="registerFormRef">
            <el-form-item prop="password" label="新&emsp;密&emsp;码">
                <el-input v-model="user.password" placeholder="请输入新密码" :prefix-icon="Lock" show-password/>
            </el-form-item>
            <el-form-item prop="password" label="确认&emsp;密码">
                <el-input v-model="user.pw" placeholder="请再次输入新密码" :prefix-icon="Lock" show-password/>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="beforeClose">取 消</el-button>
                <el-button type="primary" @click="onRegisterClick">确 定</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup>
import {onMounted, reactive, ref} from "vue";
import request from "@/request/request";
import TreadsList from "@/components/treadRelational/TreadsList.vue";
import {ArrowDownBold, CreditCard, Grape, Iphone, Lock, User} from "@element-plus/icons-vue";
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
    Object.assign(user, userInfo);  // 复制userInfo到user,表单直接绑定userInfo使用会有输入bug
    isOpen.value = true
}
// 修改用户信息
const modDialog = ref(false)
const modForm = ref(false)   // false:修改用户信息，true:修改密码
let user = reactive({
    id: '',
    username: '',
    password: '',
    pw:'',
    nickname: '',
    sex: '0',
    idCard: '',
    phone: '',
})
const rules = {
    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
    pw: [{ required: true, message: '请确认密码', trigger: 'blur' }],
    nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
    idCard: [{ required: true, message: '请输入身份证号', trigger: 'blur' }],
    phone: [{ required: true, message: '请输入电话', trigger: 'blur' }],
}      // 校验规则

const registerFormRef = ref(null);
const onRegisterClick = () => {
    registerFormRef.value.validate(valid => {
        if (valid) {   // 表单验证成功
            modUserInfo(false)
        } else {
            ElMessage.error('请检查内容输入!');
        }
    });
};
async function modUserInfo(isUpload) {
    openUserInfo.value = false;        // 关闭信息栏，修改成功时再打开，重新渲染，防止信息不同步
    if (modForm.value && user.pw !== user.password) {
        ElMessage.error('两次密码不一致!');
        return;
    }
    isUpload ? isOpen.value = false : userInfo = user;      // 如果是修改头像的就将isOpen关闭，不用赋值userInfo
    await request.post('/user/update', userInfo).then(res => {
        ElMessage.success('修改成功！');
        beforeClose();
        if (isUpload) {
            isOpen.value = true;
            openUserInfo.value = false
        }
    })
}
function beforeClose() {
    modDialog.value = false;
    modForm.value = false;
    Object.assign(user, userInfo);
    openUserInfo.value = true
}
// 更换头像相关
function beforeAvatarUpload(file) {
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
        modUserInfo(true)
    })
}
</script>

<style scoped>
.header-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
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