// 导入创建路由必要的方法
import { createRouter, createWebHashHistory } from "vue-router";
import axios from 'axios';
import { createDiscreteApi } from 'naive-ui'
const { message } = createDiscreteApi(
  ['message']
)
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
    component: Login,
    meta: {
      title: 'Chuckle|登陆'
    },
    beforeEnter: (to, from) => {
      if (localStorage.getItem("token")) {
        return { name: 'DashBoard' };
      }
    },
  },
  {
    path: '/',
    name: 'BlogHome',
    component: BlogHome,
    redirect: "/home",
    children: [
      {
        path: 'home',
        name: 'PostList',
        component: PostList,
        meta: {
          title: 'Chuckle|首页'
        },
      },
      {
        path: 'post/:id',
        name: 'Post',
        component: Post,
        meta: {
          title: 'Chuckle|文章'
        },
      },
      {
        path: 'category/:id',
        name: 'CategoryDetails',
        component: PostList,
        meta: {
          title: 'Chuckle|分类'
        },
      }
    ]
  },
  {
    path: '/dashboard',
    name: 'DashBoard',
    component: DashBoard,
    meta: {
      title: 'Chuckle|后台'
    },
    beforeEnter: async (to, from) => {
      let allow = await autoLogin();
      if (allow) {
        if (from.name !== 'Login') {
          message.success(`欢迎${localStorage.getItem("username")}`)
        }
        return true;
      } else {
        return { name: 'Login' }
      }
    },
    // 默认重定向
    redirect: "/dashboard/article",
    children: [
      {
        path: 'article',
        name: 'Article',
        component: Article,
        meta: {
          title: 'Chuckle|管理文章'
        },
      },
      {
        path: 'category',
        name: 'Category',
        component: Category,
        meta: {
          title: 'Chuckle|管理分类'
        },
      }
    ]
  },
  {
    path: '/:catchAll(.*)',
    name: 'NotFount',
    component: NotFount,
    meta: {
      title: 'Chuckle|404'
    },
  }
];

// 创建路由并暴露其返回值
const router = createRouter({
  // 配置路由模式hash和history
  history: createWebHashHistory(),
  // 使用路由配置
  routes
})

async function autoLogin() {
  let res = await axios({
    url: '/api/autoLogin',
    method: 'post',
    timeout: 5000
  })
  let result = res.data;
  if (result.code === '0000') {
    return true;
  } else {
    message.error("请先登陆")
    return false;
  }
}

router.afterEach((to, from) => {
  if (to.meta.title) {
    document.title = to.meta.title;
  }
})


export default router;