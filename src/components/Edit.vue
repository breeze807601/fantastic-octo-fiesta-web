<template>
    <div>
        <el-card class="margin" shadow="never">
            <el-input class="margin"  v-model="tread.content" :autosize="{ minRows: 3}" type="textarea" placeholder="有什么新鲜事想分享给大家"/>
            <!--选择标签-->
            <div class="margin">
                <el-select v-model="tread.treadsTagList" placeholder="选择标签......" multiple filterable>
                    <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"/>
                    <!--添加标签-->
                    <template #footer>
                        <el-button v-if="!isAdding" text bg size="small" @click="isAdding = true">添加标签</el-button>
                        <template v-else>
                            <!--标签名-->
                            <el-input v-model="optionName" placeholder="请输入标签名" style="margin-bottom: 10px" />
                            <el-button type="primary"  @click="addOption">添加</el-button>
                            <el-button  @click="optionName = '';isAdding = false">取消</el-button>
                        </template>
                    </template>
                </el-select>
            </div>
            <!--上传图片和发表动态-->
            <div class="margin">
                <el-upload :limit="9" :http-request="httpRequest" :on-remove="handleRemove" multiple
                           :show-file-list="true" list-type="picture-card" :on-exceed="onExceed"
                           :class="{uoloadBtn:true,disUoloadBtn:noneBtnImg}">
                    <template #trigger>
                        <el-icon><Plus /></el-icon>
                    </template>
                </el-upload>
            </div>
            <div style="text-align: right" >
                <el-button :loading="loading" type="primary" :icon="Position" @click="addTreads">发表动态</el-button>
            </div>
        </el-card>


    </div>
</template>

<script setup>

import { Position } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus';
import {reactive, ref} from "vue";
import request from "@/request/request";

// 动态数据
const tread = reactive({
    content: '',       // 内容
    image: [],         // 图片数组
    treadsTagList: []  // 选择的标签数组
})

const loading = ref(false);

// 标签相关
const isAdding = ref(false);  // 是否出现添加标签按钮
const optionName = ref('');   // 添加的标签名
const options = reactive({})  //标签数组
async function addOption(){   // 添加标签方法

}

// 上传图片相关
const fileList = ref([]);
const noneBtnImg = ref(false) // 动态控制图片上传按钮的class类
function httpRequest(data) {     // 添加图片
    fileList.value.push(data.file);
    if (fileList.value.length === 9) {
        noneBtnImg.value = true;
    }
}
function handleRemove(file){     // 删除图片
    const index = fileList.value.findIndex(f => f.uid === file.uid);
    if (index !== -1) {
        fileList.value.splice(index, 1);
        if (fileList.value.length < 9) {
            noneBtnImg.value = false;
        }
    }
}
function onExceed(){           // 超出图片数量提醒
    ElMessage.warning('最多上传9张图片');
}
async function uploadImage(){        // 上传图片
    loading.value = true;
    let formData = new FormData();
    fileList.value.forEach(file => {
        formData.append("multipartFiles", file);
    })
    await request.post('/common/images',formData).then(res => {
        console.log("res",res)
        tread.image = res.data;
    }).catch(err => {
        ElMessage.error(err.msg)
    })
}
async function addTreads(){  // 添加动态
    await uploadImage();  // 先上传图片获取url
    console.log("tread",tread.image)
    // 模拟添加动态
    await new Promise(resolve => setTimeout(resolve, 2000));
    loading.value = false;
}
</script>

<style>
.margin{
    margin-bottom: 10px
}
// 隐藏上传按钮
.disUoloadBtn .el-upload--picture-card{

    display:none;
}
</style>