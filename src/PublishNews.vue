<script setup lang="ts">
import '@wangeditor/editor/dist/css/style.css'
import { onBeforeUnmount, ref, shallowRef } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import type { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor'
import { saveNews as save } from '@/http/news.ts'

// ---- 编辑器相关 ----
const editorRef = shallowRef<IDomEditor | null>(null)
const mode = ref('default')
const valueHtml = ref('')

const toolbarConfig: Partial<IToolbarConfig> = {}

const editorConfig: Partial<IEditorConfig> = {
  placeholder: '请输入文本..',
  MENU_CONF: {
    uploadImage: {
      server: '/api/news/uploadImg',   // 改为相对路径，通过 Nginx 代理到后端
      fieldName: 'wangeditor-uploaded-image',
      maxFileSize: 5 * 1024 * 1024,
      maxNumberOfFiles: 5,
      allowedFileTypes: ['image/*'],
      timeout: 5 * 1000,
    },
  },
}

const handleCreated = (editor: IDomEditor) => {
  editorRef.value = editor
}

onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor) editor.destroy()
})

// ---- 表单数据 ----
const newsType = ref<number>(0)
const newsTitle = ref<string>('')

// ---- 保存新闻 ----
const saveNews = async () => {
  const newsData = {
    newsTitle: newsTitle.value,
    newsType: newsType.value,
    newsContent: valueHtml.value,
  }
  await save(newsData)   // 注意变量名是 newsData，别写错
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