<template>
  <div class="postList">
    <div class="search">
      <n-input v-model:value="pageInfo.keyword" placeholder="请输入关键字，可搜索标题、内容" style="flex: 1;"></n-input>
      <n-button type="primary" ghost @click="loadPost" style="margin-left: 10px;">搜索</n-button>
      <n-button type="primary" ghost @click="reLoad" style="margin-left: 10px;">重置</n-button>
    </div>
    <div class="card-box">
      <div v-for="item in postList" class="post-card">
        <n-card :title="item.title" style="margin-bottom: 10px;" @click="toPost(item)">
          {{ item.content }}
          <template #footer>
            <n-space align="center">
              <div>分类：{{ categoryName(item.category_id) }}</div>
              <div>发布时间：{{ dayjs(Number(item.create_time)).format("YYYY-MM-DD") }}</div>
              <div>更新时间：{{ dayjs(Number(item.revise_time)).format("YYYY-MM-DD") }}</div>
              <div v-if="props.showControl">
                <n-button @click.stop="toUpdate(item)" style="margin-right: 10px;">修改</n-button>
                <n-button @click.stop="toDelete(item)">删除</n-button>
              </div>
            </n-space>
          </template>
        </n-card>
      </div>
    </div>
    <n-space justify="center">
      <n-pagination @update:page="postStore.initPostList" v-model:page="pageInfo.page" :page-count="pageNum" />
    </n-space>
  </div>
</template>

<script setup>
import { ref, reactive, inject, onMounted, nextTick, computed, onBeforeUnmount } from "vue"
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
const dialog = inject('dialog');
const loadingBar = inject('loadingBar');
import dayjs from 'dayjs';

const { postList, postSize, pageInfo } = storeToRefs(postStore);

const pageNum = computed(() => {
  return Math.ceil(postSize.value / pageInfo.value.postNum)
})

function categoryName(id) {
  let category = postStore.categoryList.find(item => {
    return item._id === id
  })
  return category ? category.name : "无分类";
}

async function loadPost() {
  loadingBar.start();
  await postStore.initPostList();
  loadingBar.finish();
}

function reLoad() {
  postStore.pageInfo.keyword = "";
  loadPost()
}

onMounted(async () => {
  postStore.initCategoryList();
  postStore.pageInfo.category_id = route.params.id
  reLoad()
});

onBeforeUnmount(() => {
  postStore.pageInfo.keyword = "";
  postStore.pageInfo.category_id = "";
});

function toPost(item) {
  router.push({
    name: "Post",
    params: {
      id: item.post_id,
    }
  })
}

const props = defineProps({
  modelValue: {
    type: String,
    default: ""
  },
  showControl: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(["update:modelValue"])
function toUpdate(item) {
  if (!props.showControl) return;
  emit("update:modelValue", "update");
  postStore.editPost = item;
  postStore.editPost.post_id = item.post_id;
}

function toDelete(item) {
  if (!props.showControl) return;
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

<style lang="scss" scoped>
.postList {
  width: 100%;
  flex: 1;

  .search {
    margin-bottom: 15px;
    width: 100%;
    display: flex;
  }

  .card-box {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;

    .n-card.n-card--bordered {
      height: calc(100% - 10px);
    }
  }

  .post-card {
    width: calc(50% - 5px);
  }

  @media screen and (max-width:800px) {
    .post-card {
      width: 100%;
    }
  }
}
</style>