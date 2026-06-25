<template>
  <div>
    <div class="sub-menu">
      <button @click="selectView('PublishNews')" :class="{ active: currentView === 'PublishNews' }">发布新闻</button>
      <button @click="selectView('NewsList')" :class="{ active: currentView === 'NewsList' }">查看新闻</button>
    </div>
    <div class="content-area">
      <component :is="currentView ? componentMap[currentView] : null" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import NewsList from './NewsLIst.vue'
import PublishNews from '@/PublishNews.vue'

const currentView = ref<string | null>(null)

const componentMap: Record<string, any> = {
  NewsList,
  PublishNews
}

const selectView = (view: string) => {
  currentView.value = view
}
</script>

<style scoped>
.sub-menu {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
  justify-content: center;
}
.sub-menu button {
  padding: 6px 14px;
  border: 1px solid lightblue;
  background-color: #e0f7fa;
  cursor: pointer;
  border-radius: 4px;
}
.sub-menu button.active {
  background-color: #84d4e6;
  border-color: #4ba3c7;
}
.content-area {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>