import { createRouter, createWebHistory } from 'vue-router'
import { ElMessage } from 'element-plus'
import store from '@/store'
import Login from '@/views/Login.vue'
import Home from '@/views/Home.vue'
import Register from '@/views/Register.vue'
import HomePage from '@/components/HomePage.vue'
import Tag from '@/components/Tag.vue'

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
        component: HomePage
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
