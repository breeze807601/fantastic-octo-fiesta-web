import { createRouter, createWebHistory } from 'vue-router'
import { ElMessage } from 'element-plus'
import Login from '@/views/Login.vue'
import Home from '@/views/Home.vue'
import Register from '@/views/Register.vue'
import HomePage from '@/components/HomePage.vue'
import Tag from '@/components/treadRelational/Tag.vue'
import Details from "@/components/treadRelational/Details.vue";
import TreadsList from "@/components/treadRelational/TreadsList.vue";
import Webpage from "@/components/userRelational/Webpage.vue";
import MyPage from "@/components/userRelational/MyPage.vue";
import MyAttention from "@/components/userRelational/MyAttention.vue";
import MyFans from "@/components/userRelational/MyFans.vue";

const routes = [
    {
        path: '/',
        name: 'login',
        component: Login
    },
    {
        path: '/register',
        name: 'register',
        component: Register
    },
    {
        path: '/home',
        name: 'home',
        component: Home,
        redirect: '/homePage',
        children:[
            {
                path: '/homePage',
                name: 'homePage',
                component: HomePage,
                redirect: '/treadsList',
                children:[
                    {
                        path: '/treadsList',
                        name: 'treadsList',
                        component: TreadsList,
                        meta: { keepAlive: true }
                    },
                    {
                        path: '/details',
                        name: 'details',
                        component: Details
                    }
                ]
            },
            {
                path: '/webpage',
                name: 'webpage',
                component: Webpage,
                redirect: '/myPage',
                children:[
                    {
                        path: '/myPage',
                        name: 'myPage',
                        component: MyPage,
                    },
                    {
                        path: '/myAttention',
                        name: 'myAttention',
                        component: MyAttention,
                    },
                    {
                        path: '/myFans',
                        name: 'myFans',
                        component: MyFans,
                    }

                ]
            },
            {
                path: '/tag',
                name: 'tag',
                component: Tag
            }
        ]
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

//验证是否存在token，不存在即未登录，跳转登录

router.beforeEach((to, from, next) => {
    if (to.path === '/' || to.path === '/register') {
        next();
    } else {
        const token = localStorage.getItem('token');
        if (token) {
            next();
        } else {
            ElMessage({
                message: "请先登录!!",
                type: 'error',
            })
            next("/");
        }
    }
});

export default router
