<template>
    <el-card>
        <template #header>
            <div class="card-header">
                <el-avatar :size="35" style="cursor: pointer;" @error="true">
                    <img src="https://homework1015.oss-cn-beijing.aliyuncs.com/2024-07-08-15-08-281.png" />
                </el-avatar>
                <div class="info">
                    <span class="nickname">小红</span>
                    <span class="time">2024-07-19 16:46</span>
                </div>
                <div class="right-content">
                    <el-button color="#f89898" :dark="isDark" round plain>+ 关注</el-button>
                </div>
            </div>
        </template>
    </el-card>
</template>

<script setup>

</script>

<style>
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
</style>