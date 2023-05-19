<template>
  <div style="z-index:99">
    <Toolbar :editor="editorRef" :defaultConfig="toolbarConfig" :mode="mode" style="border-bottom: 1px solid #ccc" />
    <Editor :defaultConfig="editorConfig" :mode="mode" v-model="valueHtml" style="height: 100%;min-height: 150px;overflow-y: hidden;border-bottom: 1px solid #ccc;"
      @onCreated="handleCreated" @onChange="handleChange" />
  </div>
</template>

<script setup>
import '@wangeditor/editor/dist/css/style.css';
import { onBeforeUnmount, ref, shallowRef, onMounted,reactive,nextTick } from 'vue';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import { DomEditor } from '@wangeditor/editor'
// 编辑器实例，必须用 shallowRef，重要！
const editorRef = shallowRef();
// 内容 HTML
const valueHtml = ref('<p></p>');
// 模拟 ajax 异步获取内容
onMounted(() => {
  nextTick(()=>{
    valueHtml.value = props.modelValue
  })
});
// 工具栏要排除的功能
const toolbarConfig = {
  excludeKeys: ["uploadVideo","uploadImage"],
};
const mode = ref('default')
const editorConfig = { placeholder: '请输入内容...' };

// 组件销毁时，也及时销毁编辑器，重要！
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});

/* 业务逻辑 */
// 和外部双向绑定的编辑器内容
const props = defineProps({
  modelValue: {
    type: String,
    default: ""
  }
});
const emit = defineEmits(["update:modelValue"])

// 编辑器回调函数
const handleCreated = (editor) => {
  editorRef.value = editor; // 记录 editor 实例，重要！
  // 获取工具栏key
  // setTimeout(()=>{
  //   const toolbar = DomEditor.getToolbar(editor) 
  //   const curToolbarConfig = toolbar?.getConfig();
  //   console.log(curToolbarConfig?.toolbarKeys);
  // },1000)
};
const handleChange = (editor) => {
  // 每次内容更新就触发modelValue的更新
  emit("update:modelValue", valueHtml.value);
};

</script>

<style lang="scss" scoped></style>