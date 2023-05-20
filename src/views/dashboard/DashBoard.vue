<template>
  <div class="dash-board-panel">
    <n-layout has-sider>
      <n-layout-sider bordered collapse-mode="width" :collapsed-width="60" :width="180" :collapsed="collapsed"
        show-trigger @collapse="collapsed = true" @expand="collapsed = false">
        <n-menu :collapsed="collapsed" :collapsed-width="60" :collapsed-icon-size="22" :options="menuOptions"
          :default-value="route.name" />
      </n-layout-sider>
      <div class="main">
        <router-view></router-view>
        <n-back-top :right="60" />
      </div>
    </n-layout>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue"
let collapsed = ref(null);
import useUserStore from '../../stores/UserStore'
const userStore = useUserStore();
import { defineComponent, h } from "vue";
import { NIcon } from "naive-ui";
import { BookOutline, HomeOutline, BookmarksOutline, ExitOutline } from "@vicons/ionicons5";

import { useRouter, useRoute } from "vue-router"
const router = useRouter()
const route = useRoute()

function renderIcon(icon) {
  return () => h(NIcon, null, { default: () => h(icon) });
}
import { RouterLink } from "vue-router";
const menuOptions = [
  {
    label: () => h(
      RouterLink,
      {
        to: {
          name: "Article"
        }
      },
      { default: () => "文章管理" }
    ),
    key: "Article",
    icon: renderIcon(BookOutline)
  },
  {
    label: () => h(
      RouterLink,
      {
        to: {
          name: "Category"
        }
      },
      { default: () => "分类管理" }
    ),
    key: "Category",
    icon: renderIcon(BookmarksOutline),
  },
  {
    label: () => h(
      RouterLink,
      {
        to: {
          name: "BlogHome"
        }
      },
      { default: () => "回到首页" }
    ),
    key: "Logout",
    icon: renderIcon(HomeOutline),
  },
  {
    label: () => h(
      RouterLink,
      {
        to: {
          name: "Login"
        },
        onClick: () => {
          userStore.token = "";
          userStore.username = "";
          // 用户名也保留吧
          // localStorage.removeItem("username");
          localStorage.removeItem("token");
          // 保留之前的记住状态
          // localStorage.removeItem("remember");
        }
      },
      { default: () => "退出登陆" }
    ),
    key: "Logout",
    icon: renderIcon(ExitOutline),
  }
];

</script>

<style lang="scss" scoped>
.dash-board-panel {
  max-width: 1200px;
  display: flex;
  margin: 0 auto;
  position: relative;
  height: 100%;

  .menus {
    width: 100%;
    display: flex;
    box-sizing: border-box;
    flex-direction: column;
    align-content: center;
    flex-wrap: wrap;

    >div {
      padding: 10px;
    }
  }

  .main {
    width: 100%;
    padding: 10px 15px;
    overflow-y: auto;
  }
}
</style>