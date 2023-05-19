<template>
  <div>
    <n-tabs v-model:value="tabChoice" justify-content="start" type="line">
      <n-tab-pane name="list" tab="文章列表">
        <PostList v-model="tabChoice"></PostList>
      </n-tab-pane>
      <n-tab-pane name="add" tab="添加文章">
        <n-form :rules="rules" :model="post" ref="formRef">
          <n-form-item path="title" label="标题">
            <n-input v-model:value="post.title" placeholder="输入文章标题" @keydown.enter.prevent />
          </n-form-item>
          <n-form-item path="category_id" label="分类">
            <n-select v-model:value="post.category_id" :options="categoryOptions" />
          </n-form-item>
          <n-form-item path="isShow" label="是否展示">
            <n-select v-model:value="post.isShow" :options="showOptions" />
          </n-form-item>
          <RichTextEditor v-model="post.content"></RichTextEditor>
        </n-form>
        <n-form-item>
          <n-button @click="addPost">提交</n-button>
        </n-form-item>
      </n-tab-pane>
      <n-tab-pane name="update" tab="修改文章" v-if="tabChoice === 'update'">
        <UpPost></UpPost>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script setup>
import { ref, reactive, inject, onMounted } from "vue"
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
import UpPost from "../../components/UpPost.vue";

const formRef = ref(null);
// 保存要新建的文章信息
const post = ref({
  title: "",
  category_id: "",
  content: "chuckle",
  isShow: 1,//发送请求时转为bool
})
let rules = {
  title: [
    { required: true, message: "请输入文章标题", trigger: "blur" },
    { min: 1, max: 30, message: "文章标题长度1到30", trigger: "blur" }
  ]
}
const showOptions = ref([
  { label: "隐藏", value: 0, },
  { label: "展示", value: 1, }
]);
const { categoryList } = storeToRefs(postStore)
const categoryOptions = ref([]);
// 初始化分类列表
onMounted(() => {
  loadCategory()
})
async function loadCategory() {
  if (!categoryList.value.length) {
    let result = await postStore.loadCategoryList();
    if (result.code === '0000') {
    } else {
      message.error(result.msg);
      return;
    }
  }
  categoryOptions.value = categoryList.value.map((item) => {
    return {
      label: item.name,
      value: item._id
    }
  });
  categoryOptions.value.unshift({
    label: "无分类",
    value: "",
  });
}

function addPost() {
  let fromAble = true;
  formRef.value?.validate((errors) => {
    if (errors) {
      fromAble = false;
    }
  }).then(data => {
    if (!fromAble) return;
    axios({
      url: '/api/post',
      method: 'post',
      data: {
        ...post.value,
        isShow: Boolean(post.value.isShow)
      },
      timeout: 5000
    }).then(res => {
      let result = res.data;
      console.log(result);
      if (result.code === '0000') {
        message.success(result.msg);
        post.value = {
          title: "",
          category_id: "",
          content: "chuckle",
          isShow: 1,
        }
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
// 控制默认tab
const tabChoice = ref("list")




</script>

<style lang="scss" scoped></style>