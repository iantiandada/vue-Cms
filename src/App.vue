<script setup lang="ts">

import {onMounted, ref} from "vue";
import {getAllPermission, getRoleList, type Role} from "@/http/role.ts";
import MyMenuItem from "@/MyMenuItem.vue";

export interface Permission {
  id: number
  name: string
  menuType: string
  checked: boolean
  children: []
}

const roleList = ref<Role[]>([]);
const allPermission = ref<Permission[]>([]);
onMounted(async () => {
  // getRoleList是一个异步函数，这个函数执行可能需要2秒
  // 同步：一个做完，另一个接着做
  roleList.value = await getRoleList();
  console.log("所有角色数据：", roleList.value);
})
// 打开遮罩层
const openAuthDialog = async () => {
  // 获取所有权限
  allPermission.value = await getAllPermission();
  console.log(allPermission.value)

  // 给所有权限增加一个 checked属性
  // 为什么给每个权限增加一个checked属性？因为一个checkbox是否选中，就是用的checked
  // 这个属性的真或假来决定的，而且我们数据库返回过来的权限数据中并没有checked这个属性，所以需要给每个属性增加checked
  initMenuState(allPermission.value)

  // 点击授权按钮让对话框显示
  isHide.value = false;
}
// 相当于二叉树的前序遍历
const initMenuState = (treeData: Permission[]) => {
  treeData.forEach((menu) => {
    menu.checked = false;
    if (menu.children) {
      initMenuState(menu.children)
    }
  })
}

const closeAuthDialog = (e: any) => {
  // 值为true，就关闭对话框
  isHide.value = true;
}
const isHide = ref(true);

</script>

<template>
  <table>
    <tr>
      <th>角色ID</th>
      <th>角色名称</th>
      <th>操作</th>
    </tr>
    <tr v-for="role in roleList" :key="role.id">
      <td>{{ role.id }}</td>
      <td>{{ role.name }}</td>
      <td>
        <button @click="openAuthDialog">授权</button>
      </td>
    </tr>
  </table>
  <!-- 遮罩层（初始隐藏） -->
  <div id="rbacModal" class="rbac-modal-overlay" :class="{modelHide: isHide}" @click.self="closeAuthDialog">
    <div class="rbac-modal-content" id="modalContent">
      <span class="rbac-modal-close" id="closeModal" @click="closeAuthDialog">&times;</span>
      <!-- 这里放你的授权表单或内容 -->
      <!-- <div style="padding: 20px; height: 100%; box-sizing: border-box;" @click.stop> -->
      <div style="padding: 20px; height: 100%; box-sizing: border-box;">
        <h2>角色授权</h2>
        <my-menu-item
            v-for="menu in allPermission"
            :key="menu.id"
            :item="menu"
        ></my-menu-item>
      </div>
    </div>
  </div>
</template>

<style scoped>
table, tr, th, td {
  border: 1px solid black;
  border-collapse: collapse;
}

/* 遮罩层容器 */
.rbac-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5); /* 半透明黑色 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

/* 遮罩内容区 */
.rbac-modal-content {
  width: 640px;
  height: 560px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;
}

/* 关闭按钮示例（可选） */
.rbac-modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  cursor: pointer;
  font-size: 20px;
  color: #999;
}

.modelHide {
  display: none;
}

</style>
