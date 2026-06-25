<script setup lang="ts">
import { ref } from 'vue';
import RoleManager from "@/RoleManager.vue";
import NewsLIst from "@/NewsLIst.vue";
import PublishNews from "@/PublishNews.vue";
import User from "@/User.vue";
import Permission from "@/Permission.vue";
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const currentView = ref<string | null>(null);
const showNewsSubmenu = ref(false);

if (route.query.auth !== '1') {
  router.replace('/login')
}

const componentMap: Record<string, any> = {
  RoleManager,
  NewsLIst,
  PublishNews,
  User,
  Permission
};

function toggleNewsSubmenu() {
  if (showNewsSubmenu.value) {
    showNewsSubmenu.value = false;
    currentView.value = null;
  } else {
    showNewsSubmenu.value = true;
    currentView.value = null;
  }
}

function selectSubView(view: string) {
  currentView.value = view;
}
</script>

<template>
  <div>
    <span class="Menu1">目录</span>
    <div class="Button1">
      <button
          @click="currentView = 'User'; showNewsSubmenu = false"
          :class="{ 'menu-btn' : true,active: currentView === 'User'}"
      >用户管理</button>
      <button
          @click="currentView = 'RoleManager'; showNewsSubmenu = false"
          :class="{ 'menu-btn': true, active: currentView === 'RoleManager' }"
      >角色管理</button>
      <button
          @click="currentView = 'Permission'; showNewsSubmenu = false"
          :class="{ 'menu-btn': true, active: currentView === 'Permission' }"
      >权限管理</button>
      <button
          @click="toggleNewsSubmenu"
          :class="{
          'menu-btn': true,
          active: showNewsSubmenu || currentView === 'PublishNews' || currentView === 'NewsLIst'
        }"
      >新闻管理</button>
    </div>

    <div v-if="showNewsSubmenu" class="SubMenu">
      <button
          @click="selectSubView('PublishNews')"
          :class="{ 'sub-btn': true, active: currentView === 'PublishNews' }"
      >发布新闻</button>
      <button
          @click="selectSubView('NewsLIst')"
          :class="{ 'sub-btn': true, active: currentView === 'NewsLIst' }"
      >查看新闻</button>
    </div>

    <span class="Project">
      <component :is="currentView ? componentMap[currentView] : null" />
    </span>
  </div>
</template>

<style scoped>
.Menu1 {
  font-size: 24px;
  display: block;
  text-align: center;
  color: lightblue;
}

.Project {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.Button1 {
  text-align: center;
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 15px;
}

/* 基础按钮样式（主菜单） */
.menu-btn {
  background-color: lightblue;
  color: #333;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

/* 选中状态：背景变深 */
.menu-btn.active {
  background-color: #5fa8d3;   /* 比 lightblue 更深 */
  color: white;
}

/* 鼠标悬停效果（可选） */
.menu-btn:hover {
  background-color: #7ec8e3;
}

.SubMenu {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 15px;
}

/* 子菜单按钮基础样式 */
.sub-btn {
  background-color: #e0f7fa;
  color: #333;
  border: 1px solid lightblue;
  padding: 6px 14px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

/* 子菜单按钮选中状态 */
.sub-btn.active {
  background-color: #84d4e6;
  border-color: #4ba3c7;
  color: #000;
}

.sub-btn:hover {
  background-color: #c4f0f8;
}
</style>