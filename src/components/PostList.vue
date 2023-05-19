<template>
  <div>
    <div v-for="item in postList">
      <n-card :title="item.title" style="margin-bottom: 10px;">
        {{ item.content.replace(/<[^>]*>/g, '') }}
          <template #footer>
            <n-space align="center">
              <div>发布时间：{{ dayjs(Number(item.create_time)).format("YYYY-MM-DD") }}</div>
              <div>更新时间：{{ dayjs(Number(item.revise_time)).format("YYYY-MM-DD") }}</div>
              <n-button @click="toUpdate(item)">修改</n-button>
              <n-button @click="toDelete(item)">删除</n-button>
            </n-space>
          </template>
      </n-card>
    </div>
  </div>
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
import dayjs from 'dayjs';

const { postList } = storeToRefs(postStore);

onMounted(async () => {
  loadingBar.start();
  await postStore.initPostList();
  loadingBar.finish();
});
const props = defineProps({
  modelValue: {
    type: String,
    default: ""
  }
});
const emit = defineEmits(["update:modelValue"])
function toUpdate(item) {
  emit("update:modelValue", "update");
  postStore.editPost = item;
  postStore.editPost.post_id = item.post_id;
}

function toDelete(item) {
  dialog.warning({
    title: '警告',
    content: `确认删除文章: ${item.title}`,
    positiveText: '确认删除',
    negativeText: '取消',
    onPositiveClick: () => {
      axios({
        url: '/api/post/delete',
        method: 'post',
        data: {
          post_id: item.post_id,
        },
        timeout: 5000
      }).then(res => {
        let result = res.data;
        console.log(result);
        if (result.code === '0000') {
          message.success(result.msg);
          postStore.loadPostList();
        } else {
          message.error(result.msg);
        }
      }).catch(err => {
        message.error("出错了");
      })
    },
    onNegativeClick: () => { }
  })
}



</script>

<style lang="scss" scoped></style>