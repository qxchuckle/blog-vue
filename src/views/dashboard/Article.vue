<template>
  <div>
    <n-tabs v-model:value="tabChoice" justify-content="start" type="card">
      <n-tab-pane name="list" tab="文章列表">
        <PostList v-model="tabChoice"></PostList>
      </n-tab-pane>
      <n-tab-pane name="add" tab="添加文章">
        <EditPost ref="EditAdd"></EditPost>
        <n-button @click="addPost">提交</n-button>
      </n-tab-pane>
      <n-tab-pane name="update" tab="修改文章" v-if="tabChoice == 'update'">
        <EditPost ref="EditUpdate"></EditPost>
        <n-button @click="updatePost">提交</n-button>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script setup>
import { ref, reactive, inject, onMounted, watch, nextTick } from "vue"
import { storeToRefs } from 'pinia'
import useUserStore from '../../stores/UserStore'
import usePostStore from '../../stores/PostStore'
const postStore = usePostStore();
const userStore = useUserStore();
import { useRouter, useRoute } from "vue-router"
const router = useRouter()
const route = useRoute()
const axios = inject("axios");
const message = inject('message');
const notification = inject('notification');
const dialog = inject('dialog');
const loadingBar = inject('loadingBar');
import RichTextEditor from "../../components/RichTextEditor.vue";
import PostList from "../../components/PostList.vue";
import EditPost from "../../components/EditPost.vue";
// 控制默认tab
const tabChoice = ref("list")
// 获取编辑文章相关的组件
const EditAdd = ref(null);
const EditUpdate = ref(null);

const defaultPost = {
  title: "",
  category_id: "",
  content: "",
  isShow: 1,
}

function addPost() {
  let { formRef, post } = EditAdd.value;
  let fromAble = true;
  formRef?.validate((errors) => {
    if (errors) {
      fromAble = false;
    }
  }).then(data => {
    if (!fromAble) return;
    axios({
      url: '/api/post',
      method: 'post',
      data: {
        ...post,
        isShow: Boolean(post.isShow)
      },
      timeout: 5000
    }).then(res => {
      let result = res.data;
      console.log(result);
      if (result.code === '0000') {
        message.success(result.msg);
        postStore.loadPostList();
        tabChoice.value = "list"
      } else {
        message.error(result.msg);
      }
    }).catch(err => {
      console.log(err);
      message.error("出错了");
    })
  }).catch(err => {
    message.error("请检查输入框");
  })
}

watch(tabChoice, (value) => {
  if (value === 'add') {
    // 切换到添加页则初始化
    postStore.editPost = defaultPost;
    postStore.editPost.post_id = "";
  }
});

function updatePost() {
  let { formRef, post } = EditUpdate.value;
  let fromAble = true;
  formRef?.validate((errors) => {
    if (errors) {
      fromAble = false;
    }
  }).then(data => {
    if (!fromAble) return;
    axios({
      url: '/api/post/update',
      method: 'post',
      data: {
        ...post,
        isShow: Boolean(post.isShow),
        post_id: postStore.editPost.post_id
      },
      timeout: 5000
    }).then(res => {
      let result = res.data;
      console.log(result);
      if (result.code === '0000') {
        message.success(result.msg);
        postStore.loadPostList();
        tabChoice.value = "list"
      } else {
        message.error(result.msg);
      }
    }).catch(err => {
      console.log(err);
      message.error("出错了");
    })
  }).catch(err => {
    message.error("请检查输入框");
  })
}

</script>

<style lang="scss" scoped></style>