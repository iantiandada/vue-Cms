<script setup lang="ts">

import '@wangeditor/editor/dist/css/style.css'
import {onBeforeUnmount,ref,shallowRef,onMounted} from "vue";
import {Editor,Toolbar} from "@wangeditor/editor-for-vue";
import {saveNews as save,} from "@/http/news.ts";

const editorRef=shallowRef()
const toolbarConfig= {}
onBeforeUnmount(()=>{
  const editor=editorRef.value
  if(editor == null) return
  editor.destroy()
})

const mode=ref("default")
//内容html，提交给后端使用
const valueHtml=ref()
const editorConfig = {
  placeholder:"请输入文本..",
  MENU_CONF: {},
}
editorConfig.MENU_CONF['uploadImage'] = {
  server: 'http://localhost:9002/api/news/uploadImg',
  // form-data fieldName，默认值 'wangeditor-uploaded-image'
  fieldName: 'wangeditor-uploaded-image',
  // 单个文件的最大体积限制，默认为 2M
  maxFileSize: 5 * 1024 * 1024, // 1M
  // 最多可上传几个文件，默认为 100
  maxNumberOfFiles: 5,
  // 选择文件时的类型限制，默认为 ['image/*'] 。如不想限制，则设置为 []
  allowedFileTypes: ['image/*'],
  // 超时时间，默认为 10 秒
  timeout: 5 * 1000, // 5 秒
}
const handleCreated = (editor) => {
  editorRef.value = editor
}
const newsType=ref<number>(0)
const newsTitle=ref<string>('')
const saveNews = async()=>{
  //准备data
  let newsData = {
    title :newsTitle.value,
    category :newsType.value,
    content:valueHtml.value
  }
  await save(newsData);
}
</script>

<template>
  <div>
    新闻标题 <input type="text" v-model="newsTitle">
    栏目:
    <select v-model="newsType">
      <option value="1">学院新闻</option>
      <option value="2">通知公告</option>
      <option value="3">学术活动</option>
      <option value="4">学工新闻</option>
    </select>
  </div>
  <div style="border: 1px solid #ccc ;height: 600px">
    <Toolbar
        style="border-bottom: 1px solid #ccc"
        :editor="editorRef"
        :defaultConfig="toolbarConfig"
        :mode="mode"
    />
    <Editor
        style="height: 500px; overflow-y: hidden;"
        v-model="valueHtml"
        :defaultConfig="editorConfig"
        :mode="mode"
        @onCreated="handleCreated"
    />
  </div>
  <div>
    <button @click="saveNews">保存新闻</button>
  </div>
</template>

<style scoped>

</style>