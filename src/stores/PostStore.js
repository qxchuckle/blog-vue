import { defineStore } from 'pinia'
import axios from 'axios';
import { createDiscreteApi } from 'naive-ui'
const { message } = createDiscreteApi(
  ['message']
)
// 创建并暴露一个store
export default defineStore('PostStore', {
  state: () => {
    return {
      categoryList: [],
      postList: [],
      editPost: {
        title: "",
        category_id: "",
        content: "",
        isShow: 1,
      },
      post_id: "",
      postSize: 0,
      pageInfo: {
        page: 1,
        // 查找关键字
        keyword: "",
        // 分类
        category_id: "",
        // 每页显示文章数
        postNum: 8
      },
    }
  },
  actions: {
    loadCategoryList: async function () {
      let msg = "";
      try {
        let res = await axios({
          url: '/api/category',
          method: 'get',
          timeout: 5000
        })
        let result = res.data;
        console.log(result)
        msg = result.msg;
        this.categoryList = result.data.categoryArr;
        return result;
      } catch (e) {
        message.error(msg);
      }
    },
    initCategoryList: async function (){
      if (!this.categoryList.length) {
        let result = await this.loadCategoryList();
        if (!(result.code === '0000')) {
          message.error(result.msg);
        }
      }
    },
    loadPostList: async function () {
      let msg = "";
      console.log(this.pageInfo.category_id);
      try {
        let res = await axios({
          url: '/api/post',
          params: {
            page: this.pageInfo.page,
            postNum: this.pageInfo.postNum,
            keyword: this.pageInfo.keyword,
            category_id: this.pageInfo.category_id
          },
          method: 'get',
          timeout: 5000
        })
        let result = res.data;
        console.log(result)
        msg = result.msg;
        this.postList = result.data.postArr;
        this.postSize = result.data.postSize;
        return result;
      } catch (e) {
        message.error(msg);
      }
    },
    initPostList: async function (page = 1) {
      // if (!this.postList.length) {
        this.pageInfo.page = page;
        let result = await this.loadPostList();
        if (!(result.code === '0000')) {
          message.error(result.msg);
        }
      // }
    },
    getOnePost: async function (post_id) {
      let msg = "";
      try {
        let res = await axios({
          url: `/api/post/one?post_id=${post_id}`,
          method: 'get',
          timeout: 5000
        })
        let result = res.data;
        console.log(result)
        msg = result.msg;
        return result;
      } catch (e) {
        message.error(msg);
      }
    }
  },
  getters: {}
});