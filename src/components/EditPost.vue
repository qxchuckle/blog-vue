<template>
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
</template>

<script setup>
import { ref, reactive, inject, onMounted, nextTick } from "vue"
import { storeToRefs } from 'pinia'
import useUserStore from '../stores/UserStore'
import usePostStore from '../stores/PostStore'
const userStore = useUserStore();
const postStore = usePostStore();
import { useRouter, useRoute } from "vue-router"
const router = useRouter()
const route = useRoute()
const axios = inject("axios");
const message = inject('message');
const notification = inject('notification');
const dialog = inject('dialog');
const loadingBar = inject('loadingBar');
import RichTextEditor from "./RichTextEditor.vue";

const formRef = ref(null);
// 要保存的文章信息
const post = ref({
  title: "",
  category_id: "",
  content: "",
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
onMounted( async () => {
  loadCategory()
  post.value.title = postStore.editPost.title
  post.value.category_id = postStore.editPost.category_id
  post.value.isShow = postStore.editPost.isShow ? 1 : 0;
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
defineExpose({
  formRef,
  post
})
</script>

<style lang="scss" scoped></style>