<template>
  <div>
    2342432424
  </div>
</template>

<script setup>
import { ref, reactive, inject, onMounted,nextTick } from "vue"
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
let spinShow = ref(false);
let showAdd = ref(false);
import dayjs from 'dayjs';

const {postList} = storeToRefs(postStore);

onMounted(async () => {
  loadingBar.start();
  await postStore.initPostList();
  loadingBar.finish();
  // console.log(dayjs(Number(postList.value[1].create_time)).format("YYYY-MM-DD"));
});

</script>

<style lang="scss" scoped>

</style>