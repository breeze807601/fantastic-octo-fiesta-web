<template>
    <div>
        <el-card class="margin" shadow="never">
            <el-input class="margin"  v-model="tread.content" :autosize="{ minRows: 3}" type="textarea" placeholder="有什么新鲜事想分享给大家"/>
            <!--选择标签-->
            <div class="margin">
                <el-select v-model="tread.treadsTagList" placeholder="选择标签......" multiple filterable>
                    <el-option v-for="item in tagList.value" :key="item.id" :label="item.name" :value="item.id"/>
                    <!--添加标签-->
                    <template #footer>
                        <el-button v-if="!isAdding" text bg size="small" @click="isAdding = true">添加标签</el-button>
                        <template v-else>
                            <!--标签名-->
                            <el-input v-model="optionName" placeholder="请输入标签名" class="margin" />
                            <el-button type="primary"  @click="addTag">添加</el-button>
                            <el-button  @click="optionName = '';isAdding = false">取消</el-button>
                        </template>
                    </template>
                </el-select>
            </div>
            <!--上传图片和发表动态-->
            <div style="display: flex;justify-content: space-between;">
                <div style="flex: 1">
                    <el-popover :visible="popover" placement="bottom" :width="500" class="custom-popper">
                        <el-upload :http-request="httpRequest" :on-remove="handleRemove" :show-file-list="true"
                                   multiple list-type="picture-card" :on-exceed="onExceed" :limit="9" >
                            <template #trigger>
                                <el-icon><Plus /></el-icon>
                            </template>
                        </el-upload>
                        <el-button type="text" size="small" @click="popover = false" style="position: absolute; top: 1px; right: 1px">
                            <el-icon><Close /></el-icon>
                        </el-button>
                        <template #reference>
                            <el-button type="primary" :icon="Upload" @click="popover = true">上传图片</el-button>
                        </template>
                    </el-popover>
                </div>
                <div style="flex: 1;text-align: right" >
                   <el-button :loading="loading" type="primary" :icon="Position" @click="addTreads">发表动态</el-button>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script setup>

import { Position,Upload } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus';
import {reactive, ref} from "vue";
import request from "@/request/request";

// 动态数据
const tread = reactive({
    content: '',       // 内容
    imageList: [],         // 图片数组
    treadsTagList: []  // 选择的标签数组
})

const loading = ref(false);

// 标签相关
getTagList();
const isAdding = ref(false);  // 是否出现添加标签按钮
const optionName = ref('');   // 添加的标签名
const tagList = reactive({})  //标签数组
async function getTagList(){
    await request.get('/tag/get').then(res => {
        tagList.value = res.data;
    })
}
async function addTag(){   // 添加标签方法
    await request.post('/tag',{name:optionName.value}).then(res => {
        optionName.value = '';
        isAdding.value = false;
        console.log("addT",res)
        tagList.value.push(res.data)
        ElMessage.success(res.data.msg? res.data.msg : '添加成功!');
    })
}

// 上传图片相关
const popover = ref(false);   // 图片上传弹窗
const fileList = ref([]);
function httpRequest(data) {     // 添加图片
    fileList.value.push(data.file);
}
function handleRemove(file){     // 删除图片
    const index = fileList.value.findIndex(f => f.uid === file.uid);
    if (index !== -1) {
        fileList.value.splice(index, 1);
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
        console.log("uploadImage",res)
        tread.imageList = res.data;
    }).catch(err => {
        ElMessage.error(err.msg)
    })
}
async function addTreads(){  // 添加动态
    if (fileList.value.length > 0){
        await uploadImage();  // 先上传图片获取url
    }
    // 将标签id组转换成 TreadsTag 实例的列表
    tread.treadsTagList = tread.treadsTagList.map(tagId => ({
        tagId: tagId,
    }));
    tread.imageList  =  tread.imageList.map(url => ({
        url: url,
    }))
    await request.post('/tread',tread).then(res => {
        tread.content = '';
        tread.image = [];
        tread.treadsTagList = [];
        // fileList.value = [];
        fileList.value.splice(0, fileList.value.length);
        ElMessage.success(res.data.msg? res.data.msg : '发表成功!')
    })
    loading.value = false;
}
</script>

<style>
.margin{
    margin-bottom: 10px
}
.custom-popper {
    padding: 16px; /* 添加内边距 */
}
/* 隐藏预览按钮 */
.el-upload-list--picture-card .el-upload-list__item-preview {
    display: none !important;
}
</style>