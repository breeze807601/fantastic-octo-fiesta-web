<template>
    <div>
        <el-row>
            <el-col :span="6" :offset="1">
                <el-card>
                    hello
                </el-card>
            </el-col>
            <el-col :span="14" :offset="2">
                <div>
                    <router-view v-slot="{ Component, route }">
                        <keep-alive>
                            <component :is="Component" :key="route.name" v-if="route.meta.keepAlive"/>
                        </keep-alive>
                        <component :is="Component" :key="route.name" v-if="!route.meta.keepAlive"/>
                    </router-view>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script setup>

</script>

<style>

</style>