<template>
  <n-spin :show="spinShow">
    <div class="category-panel">
      <n-table :bordered="false" :single-line="false" size="small">
        <thead>
          <tr>
            <th>序号</th>
            <th>ID</th>
            <th>名称</th>
            <th>操作
              <n-button @click="showAdd = true">添加</n-button>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="categoryList" v-for="(item, index) in categoryList" :key="item._id">
            <td>{{ index + 1 }}</td>
            <td>{{ item._id }}</td>
            <td>{{ item.name }}</td>
            <td>
              <n-space>
                <n-button @click="toUpdate(item)">修改</n-button>
                <n-button @click="deleteCategory(item)">删除</n-button>
              </n-space>
            </td>
          </tr>
        </tbody>
      </n-table>
      <n-modal v-model:show="showAdd" preset="dialog" title="Dialog">
        <template #header>
          <div>添加分类</div>
        </template>
        <n-form :rules="rules" :model="newCategory" ref="formRef">
          <n-form-item path="name" label="分类名">
            <n-input v-model:value="newCategory.name" placeholder="输入分类名" @keydown.enter.prevent />
          </n-form-item>
        </n-form>
        <template #action>
          <div>
            <n-button @click="addCategory">提交</n-button>
          </div>
        </template>
      </n-modal>
      <n-modal v-model:show="showUpdate" preset="dialog" title="Dialog">
        <template #header>
          <div>修改分类</div>
        </template>
        <n-form :rules="rules" :model="newUpdate" ref="formRef">
          <n-form-item path="name" label="分类名">
            <n-input v-model:value="newUpdate.name" placeholder="输入分类名" @keydown.enter.prevent />
          </n-form-item>
        </n-form>
        <template #action>
          <div>
            <n-button @click="updateCategory">提交</n-button>
          </div>
        </template>
      </n-modal>
    </div>
  </n-spin>
</template>

<script setup>
import { ref, reactive, inject, onMounted } from "vue"
import { storeToRefs } from 'pinia'
import useUserStore from '../../stores/UserStore'
const userStore = useUserStore();
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
// 分类数据
let categoryList = ref(null)
const newCategory = reactive({
  name: ""
})
// 加载数据
async function loadData() {
  spinShow.value = true;
  let res = await axios({
    url: '/api/category',
    method: 'get',
    timeout: 5000
  })
  spinShow.value = false;
  let result = res.data;
  if (result.code === '0000') {
    categoryList.value = result.data.categoryArr;
  } else {
    message.error(result.msg);
  }
}

onMounted(() => {
  loadData();
});

let rules = {
  name: [
    { required: true, message: "请输入分类名", trigger: "blur" },
    { min: 1, max: 15, message: "分类名长度1到15", trigger: "blur" }
  ]
}
const formRef = ref(null);
// 添加分类
function addCategory() {
  let fromAble = true;
  formRef.value?.validate((errors) => {
    if (errors) {
      fromAble = false;
    }
  }).then(data => {
    if (!fromAble) return;
    axios({
      url: '/api/category',
      method: 'post',
      data: {
        name: newCategory.name,
      },
      timeout: 5000
    }).then(res => {
      let result = res.data;
      console.log(result);
      if (result.code === '0000') {
        message.success(result.msg);
        showAdd.value = false;
        loadData();
      } else {
        message.error(result.msg);
      }
    }).catch(err => {
      message.error("出错了");
    })
  }).catch(err => {
    message.error("请检查输入框");
  })
}
// 删除
function deleteCategory(item) {
  dialog.warning({
    title: '警告',
    content: `确认删除分类: ${item.name}`,
    positiveText: '确认删除',
    negativeText: '取消',
    onPositiveClick: () => {
      axios({
        url: '/api/category/delete',
        method: 'post',
        data: {
          category_id: item._id,
        },
        timeout: 5000
      }).then(res => {
        let result = res.data;
        console.log(result);
        if (result.code === '0000') {
          message.success(result.msg);
          loadData();
        } else {
          message.error(result.msg);
        }
      }).catch(err => {
        message.error("出错了");
      })
    },
    onNegativeClick: () => {
    }
  })
}
// 要提交的更新数据
const newUpdate = reactive({
  category_id: "",
  name: "",
})
let showUpdate = ref(false);
function toUpdate(item) {
  newUpdate.category_id = item._id;
  newUpdate.name = item.name;
  // 显示修改框
  showUpdate.value = true;
}
// 修改/更新
function updateCategory() {
  let fromAble = true;
  formRef.value?.validate((errors) => {
    if (errors) {
      fromAble = false;
    }
  }).then(data => {
    if (!fromAble) return;
    axios({
      url: '/api/category/update',
      method: 'post',
      data: {
        category_id: newUpdate.category_id,
        name: newUpdate.name,
      },
      timeout: 5000
    }).then(res => {
      let result = res.data;
      console.log(result);
      if (result.code === '0000') {
        message.success(result.msg);
        showUpdate.value = false;
        loadData();
      } else {
        message.error(result.msg);
      }
    }).catch(err => {
      message.error("出错了");
    })
  }).catch(err => {
    message.error("请检查输入框");
  })
}

</script>

<style lang="scss" scoped>
.category-panel {
  height: 100vh;
}
</style>