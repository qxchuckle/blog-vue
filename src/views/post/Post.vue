<template>
  <div class="post-container">
    <n-space justify="center">
      <n-h1>{{ postInfo.title }}</n-h1>
    </n-space>
    <n-space justify="center">
      <n-tag>{{ postInfo.category }}</n-tag>
      <n-tag>发布时间：{{ postInfo.createTime }}</n-tag>
      <n-tag>更新时间：{{ postInfo.reviseTime }}</n-tag>
    </n-space>
    <n-divider />
    <div class="post-content" v-html="postInfo.content"></div>
  </div>
</template>

<script setup>
import { ref, reactive, inject, onMounted } from "vue"
import { storeToRefs } from 'pinia'
import usePostStore from '../../stores/PostStore'
const postStore = usePostStore();
import { useRoute } from "vue-router"
const route = useRoute()
const message = inject('message');
const loadingBar = inject('loadingBar');
import dayjs from 'dayjs';

const postInfo = reactive({
  title: '',
  content: '',
  category: '',
  createTime: '',
  reviseTime: '',
})

onMounted(async () => {
  loadingBar.start();
  let result = await postStore.getOnePost(route.params.id);
  if (result.code === '0000') {
    let data = result.data;
    postInfo.title = data.title;
    postInfo.content = data.content;
    postInfo.createTime = dayjs(Number(data.create_time)).format("YYYY-MM-DD");
    postInfo.reviseTime = dayjs(Number(data.revise_time)).format("YYYY-MM-DD")
    await postStore.initCategoryList();
    let category = postStore.categoryList.find((item) => {
      return item._id === data.category_id;
    })
    // console.log(category);
    postInfo.category = category ? category.name : "无分类";

  } else {
    message.error(result.msg);
  }
  loadingBar.finish();
})

</script>

<style lang="scss" scoped>
.post-container {
  width: 100%;

  .post-content {
    font-size: 16px;
  }
}
</style>