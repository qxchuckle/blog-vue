// 导入创建路由必要的方法
import { createRouter, createWebHashHistory } from "vue-router";
// 路由懒加载
const Login = () => import('../views/Login.vue')
const DashBoard = () => import('../views/dashboard/DashBoard.vue')
const Category = () => import('../views/dashboard/Category.vue')
const Article = () => import('../views/dashboard/Article.vue')
const BlogHome = () => import('../views/BlogHome.vue')
const PostList = () => import('../components/PostList.vue')
const Post = () => import('../views/post/Post.vue')
const NotFount = () => import('../views/NotFount.vue')

// 路由配置
const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/',
    name: 'BlogHome',
    component: BlogHome,
    redirect: "/home",
    children: [
      {
        path: '/home',
        name: 'PostList',
        component: PostList,
      },
      {
        path: '/post/:id',
        name: 'Post',
        component: Post,
      }
    ]
  },
  {
    path: '/dashboard',
    name: 'DashBoard',
    component: DashBoard,
    // 默认重定向
    redirect: "/dashboard/article",
    children: [
      {
        path: 'article',
        name: 'Article',
        component: Article
      },
      {
        path: 'category',
        name: 'Category',
        component: Category,
      }
    ]
  },
  {
    path: '/:catchAll(.*)',
    name: 'NotFount',
    component: NotFount
  }
];

// 创建路由并暴露其返回值
export default createRouter({
  // 配置路由模式hash和history
  history: createWebHashHistory(),
  // 使用路由配置
  routes
})