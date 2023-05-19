<template>
  <div class="dash-board-panel">
    <n-layout has-sider>
      <n-layout-sider bordered collapse-mode="width" :collapsed-width="60" :width="180" :collapsed="collapsed"
        show-trigger @collapse="collapsed = true" @expand="collapsed = false">
        <n-menu :collapsed="collapsed" :collapsed-width="60" :collapsed-icon-size="22" :options="menuOptions" />
      </n-layout-sider>
      <div class="main">
        <router-view></router-view>
      </div>
      <n-layout />
    </n-layout>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue"
let collapsed = ref(null);

import { defineComponent, h } from "vue";
import { NIcon } from "naive-ui";
import {
  BookOutline as BookIcon,
  PersonOutline as PersonIcon,
  WineOutline as WineIcon
} from "@vicons/ionicons5";

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
    key: "article",
    icon: renderIcon(BookIcon)
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
    key: "category",
    icon: renderIcon(BookIcon),
  },
  {
    label: () => h(
      RouterLink,
      {
        to: {
          name: "Login"
        }
      },
      { default: () => "退出" }
    ),
    key: "logout",
    icon: renderIcon(BookIcon),
  }
];

function toPage(route){
  router.push({
    name: route
  })
}

// let menus = [
//   { name: "文章管理", routeName: "Article"},
//   { name: "分类管理", routeName: "Category"},
//   { name: "退出", routeName: "Logout"},
// ]

// function toPage(item){
//   if(item.routeName === "Logout"){

//   }
// }

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