// 导入创建路由必要的方法
import { createRouter, createWebHashHistory } from "vue-router";
// 路由懒加载
const Test = () => import('../views/Test.vue')
const Login = () => import('../views/Login.vue')
const DashBoard = () => import('../views/dashboard/DashBoard.vue')
const Category = () => import('../views/dashboard/Category.vue')

// 路由配置
const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/dashboard',
    name: 'DashBoard',
    component: DashBoard,
    children: [
      {
        path: 'category',
        name: 'Category',
        component: Category,
      }
    ]
  },
  {
    path: '/test',
    name: 'Test',
    component: Test
  }
];

// 创建路由并暴露其返回值
export default createRouter({
  // 配置路由模式hash和history
  history: createWebHashHistory(),
  // 使用路由配置
  routes
})