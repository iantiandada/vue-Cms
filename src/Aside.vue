<template>
  <div class="app-layout">
    <!-- Header -->
    <header class="app-header">
      <div class="header-left">
        <h2 class="sys-title">后台管理系统</h2>
      </div>
      <div class="header-right">
        <span class="user-info">当前用户：{{ userStore.username }}</span>
        <button @click="logout" class="logout-btn">退出登录</button>
      </div>
    </header>

    <!-- Body：左侧菜单 + 右侧内容 -->
    <div class="app-body">
      <!-- 左侧树形菜单 -->
      <aside class="app-sidebar">
        <h3 style="padding: 0 12px;">权限菜单</h3>
        <MenuTree
            v-if="menuTree.length"
            :data="menuTree"
            @select="handleMenuSelect"
        />
        <p v-else style="padding: 0 12px;">无权限菜单或加载中...</p>
      </aside>

      <!-- 右侧主内容区 -->
      <main class="app-main">
        <div v-if="!currentComponent">
          <h2>哇哈哈欢迎，{{ userStore.username }}</h2>
          <p>请从左侧菜单选择功能。</p>
        </div>
        <component v-else :is="currentComponent" />
      </main>
    </div>

    <!-- Footer -->
    <footer class="app-footer">
      <p>lyt管理系统</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { userStore } from '@/store/userStore'
import { getAllPermission } from '@/http/permission'  // 请根据实际接口路径调整
import MenuTree from './MenuTree.vue'


import User from '@/User.vue'                  // 用户管理
import RoleManager from '@/RoleManager.vue'   // 角色管理
import Permission from '@/Permission.vue'     // 权限管理
import NewsManager from './NewsManager.vue'   // 新闻管理（包含子菜单）

const router = useRouter()
const route = useRoute()

const menuTree = ref<any[]>([])
const currentComponent = ref<any>(null)

// 构建树形结构
function buildTree(list: any[], parentId: number | null = 0): any[] {
  return list
      .filter(item => item.parentId === parentId)
      .map(item => ({
        ...item,
        children: buildTree(list, item.id)
      }))
}

// 根据用户权限ID过滤树节点
function filterTree(tree: any[], allowedIds: number[]): any[] {
  return tree
      .filter(node => allowedIds.includes(node.id))
      .map(node => ({
        ...node,
        children: node.children ? filterTree(node.children, allowedIds) : []
      }))
}

// 组件映射表：权限 code → 组件
const componentMap: Record<string, any> = {
  'account:manage': User,
  'role:manage': RoleManager,
  'permission:manage': Permission,
  'content:manage': NewsManager,
}

// 菜单点击处理
const handleMenuSelect = (item: any) => {
  currentComponent.value = componentMap[item.code] || null
}

onMounted(async () => {
  // 刷新拦截
  if (route.query.auth !== '1') {
    router.replace('/login')
    return
  }
  try {
    const res = await getAllPermission()
    const all = res.data || res
    const fullTree = buildTree(all)
    menuTree.value = filterTree(fullTree, userStore.permissionIds)
  } catch (error) {
    console.error('获取权限失败', error)
  }
})

const logout = () => {
  userStore.clear()
  router.replace('/login')
}
</script>

<style scoped>
/* 样式与原来完全一致，此处保留原完整样式 */
.app-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.app-header {
  height: 60px;
  background-color: lightblue;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  flex-shrink: 0;
}
.sys-title {
  margin: 0;
  font-size: 20px;
}
.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}
.user-info {
  font-size: 14px;
}
.logout-btn {
  background: white;
  color: #409eff;
  border: none;
  padding: 6px 14px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}
.logout-btn:hover {
  background: #ecf5ff;
}

.app-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.app-sidebar {
  width: 240px;
  background-color: #f5f5f5;
  padding: 16px 0;
  overflow-y: auto;
  flex-shrink: 0;
  border-right: 1px solid #e0e0e0;
}

.app-main {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  background-color: #ffffff;
}

.app-footer {
  height: 40px;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 1px solid #e0e0e0;
  flex-shrink: 0;
}
.app-footer p {
  margin: 0;
  font-size: 12px;
  color: #666;
}
</style>