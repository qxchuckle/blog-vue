<template>
  <div class="container">
    <div class="nav">
      <div @click="toHome">首页</div>
      <div>
        <n-popselect v-model:value="selectCategory" :options="categoryOptions" trigger="click">
          <div>分类<span class="categoryName">{{ categoryName }}</span></div>
        </n-popselect>
      </div>
      <div @click="toLogin">后台</div>
    </div>
    <n-divider />
      <router-view></router-view>
    <n-divider />
    <div id="footer">
      <div>@轻笑Chuckle</div>
      <div>粤ICP备2022076449号</div>
    </div>
    <n-back-top :right="60" />
  </div>
</template>

<script setup>
import { ref, reactive, inject, onMounted,computed } from "vue"
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

onMounted(async () => {
  loadCategory();
})

async function loadPost(){
  loadingBar.start();
  await postStore.initPostList();
  loadingBar.finish();
}

function reLoad() {
  postStore.pageInfo.keyword = "";
  loadPost()
}

const { categoryList } = storeToRefs(postStore)
const categoryOptions = ref([]);
const selectCategory = ref("");

async function loadCategory() {
  await postStore.initCategoryList();
  categoryOptions.value = categoryList.value.map((item) => {
    return {
      label: item.name,
      value: item._id
    }
  });
}
// 计算属性，找到当前选择的分类
const categoryName = computed(()=>{
  let select = categoryOptions.value.find(item=>{
    return selectCategory.value === item.value;
  })
  return select ? select.label : "";
})

function toHome(){
  reLoad()
  router.push({
    name: "BlogHome"
  })
}
function toLogin(){
  router.push({
    name: "Login"
  })
}

</script>

<style lang="scss" scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 10px;
}

.nav {
  display: flex;
  font-size: 20px;
  padding-top: 20px;
  color: #363636;

  >div {
    cursor: pointer;
    margin-right: 15px;

    &:hover {
      color: #0b84e0;
    }
  }
}
#footer {
  text-align: center;
  width: 100%;
  color: rgb(150, 150, 150);
  font-size: 14px;
  line-height: 20px;
}
</style>