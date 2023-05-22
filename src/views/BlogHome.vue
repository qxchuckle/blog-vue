<template>
  <div class="container">
    <n-spin :show="postStore.homeLoadShow">
      <div class="nav">
        <div @click="toHome">首页</div>
        <div>
          <n-popselect v-model:value="selectCategory" :options="categoryOptions" trigger="hover"
            @update:value="toCategory">
            <div>分类<span class="categoryName">{{ categoryName }}</span></div>
          </n-popselect>
        </div>
        <div @click="toDashBoard">后台</div>
      </div>
      <n-divider />
      <router-view :key="route.fullPath"></router-view>
      <n-divider />
      <div id="footer">
        <div>@轻笑Chuckle</div>
        <div>一个博客 一叶孤舟 一方世界</div>
      </div>
      <n-back-top :right="60" />
    </n-spin>
  </div>
</template>

<script setup>
import { ref, reactive, inject, onMounted, computed } from "vue"
import { storeToRefs } from 'pinia'
import usePostStore from '../stores/PostStore'
const postStore = usePostStore();
import { useRouter, useRoute } from "vue-router"
const router = useRouter()
const route = useRoute()
const message = inject('message');
const loadingBar = inject('loadingBar');

onMounted(async () => {
  loadCategory();
})

async function loadPost() {
  loadingBar.start();
  await postStore.initPostList();
  loadingBar.finish();
}

async function reLoad() {
  postStore.pageInfo.keyword = "";
  await loadPost()
}

const { categoryList } = storeToRefs(postStore)
const categoryOptions = ref([]);
const selectCategory = ref("");

async function loadCategory() {
  await postStore.initCategoryList();
  categoryOptions.value = categoryList.value.map((item) => {
    if (item._id === route.params.id) {
      selectCategory.value = item._id;
    }
    return {
      label: item.name,
      value: item._id
    }
  });
}
// 计算属性，找到当前选择的分类
const categoryName = computed(() => {
  let select = categoryOptions.value.find(item => {
    return selectCategory.value === item.value;
  })
  return select ? select.label : "";
})

async function toHome() {
  postStore.homeLoadShow = true;
  selectCategory.value = "";
  postStore.pageInfo.category_id = "";
  postStore.pageInfo.keyword = "";
  await reLoad()
  router.push({
    name: "BlogHome"
  })
  postStore.homeLoadShow = false;
}
function toDashBoard() {
  postStore.homeLoadShow = true;
  selectCategory.value = "";
  postStore.pageInfo.category_id = "";
  postStore.pageInfo.keyword = "";
  router.push({
    name: "DashBoard"
  })
}

async function toCategory(value) {
  postStore.homeLoadShow = true;
  postStore.pageInfo.category_id = value
  await reLoad()
  router.push({
    name: "CategoryDetails",
    params: {
      id: value
    }
  });
  postStore.homeLoadShow = false;
}



</script>

<style lang="scss" scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 10px;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  height: 100%;
}

.nav {
  display: flex;
  font-size: 22px;
  padding-top: 20px;
  color: #363636;
  margin-left: 10px;

  >div {
    cursor: pointer;
    margin-right: 15px;
    transition: all 0.3s;

    .categoryName {
      font-size: 14px;
      margin-left: 5px;
    }

    &:hover {
      color: #2c97d9;
    }
  }
}

#footer {
  text-align: center;
  width: 100%;
  color: rgb(150, 150, 150);
  font-size: 14px;
  line-height: 20px;
  padding-bottom: 5px;
}
</style>