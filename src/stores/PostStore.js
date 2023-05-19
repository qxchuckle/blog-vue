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
    loadPostList: async function () {
      let msg = "";
      try {
        let res = await axios({
          url: '/api/post',
          method: 'get',
          timeout: 5000
        })
        let result = res.data;
        console.log(result)
        msg = result.msg;
        this.postList = result.data.postArr;
        return result;
      } catch (e) {
        message.error(msg);
      }
    },
    initPostList: async function () {
      if (!this.postList.length) {
        let result = await this.loadPostList();
        if (!(result.code === '0000')) {
          message.error(result.msg);
        }
      }
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