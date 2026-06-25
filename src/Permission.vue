<script setup lang="ts">
import { ref, onMounted } from "vue"
import { getAllPermission, deletePermission, addPermission } from "@/http/permission.ts"

export interface Permission {
  id: number
  name: string
  menuType: string
  parentId?: number
}

const permissionList = ref<Permission[]>([])
const showAddDialog = ref(false)
const newPermission = ref({
  name: '',
  menuType: 'MENU',
  parentId: null as number | null
})

// 获取权限列表
const fetchPermissions = async () => {
  const res = await getAllPermission()
  permissionList.value = res.data || res
}

onMounted(fetchPermissions)

// 删除权限
const permissionDelete = async (id: number) => {
  if (!confirm('确定要删除该权限吗？')) return
  try {
    await deletePermission(id)
    await fetchPermissions()
  } catch (error) {
    console.error('删除失败', error)
    alert('删除失败')
  }
}

// 打开添加对话框
const openAddDialog = () => {
  newPermission.value = { name: '', menuType: 'MENU', parentId: null }
  showAddDialog.value = true
}

// 提交添加
const submitAdd = async () => {
  if (!newPermission.value.name.trim()) {
    alert('请输入权限名称')
    return
  }
  try {
    const payload = {
      name: newPermission.value.name,
      menuType: newPermission.value.menuType,
      parentId: newPermission.value.parentId
    }
    await addPermission(payload)
    showAddDialog.value = false
    await fetchPermissions()
    alert('添加成功')
  } catch (error) {
    console.error('添加失败', error)
    alert('添加失败')
  }
}

</script>

<template>
  <div>
    <button class="addPermission" @click="openAddDialog">添加权限</button>
    <table>
      <tr>
        <th>权限id</th>
        <th>权限名</th>
        <th>权限类型</th>
        <th>操作</th>
      </tr>
      <tr v-for="permission in permissionList" :key="permission.id">
        <td>{{ permission.id }}</td>
        <td>{{ permission.name }}</td>
        <td>{{ permission.menuType }}</td>
        <td>
          <button @click="permissionDelete(permission.id)">删除</button>
        </td>
      </tr>
    </table>

    <!-- 悬浮弹窗，样式与用户管理对话框完全一致 -->
    <div v-if="showAddDialog" class="modal-mask" @click.self="showAddDialog = false">
      <div class="modal-box">
        <h3>添加权限</h3>
        <form @submit.prevent="submitAdd">
          <div class="form-item">
            <label>权限名称：</label>
            <input v-model="newPermission.name" type="text" required />
          </div>
          <div class="form-item">
            <label>菜单类型：</label>
            <select v-model="newPermission.menuType">
              <option value="DIRECTORY">目录</option>
              <option value="MENU">菜单</option>
              <option value="BUTTON">按钮</option>
            </select>
          </div>
          <div class="form-item">
            <label>父级权限：</label>
            <select v-model="newPermission.parentId">
              <option :value="null">无（顶级）</option>
              <option v-for="p in permissionList" :key="p.id" :value="p.id">
                {{ p.name }}
              </option>
            </select>
          </div>
          <div class="modal-buttons">
            <button type="button" @click="showAddDialog = false">取消</button>
            <button type="submit">保存</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
table, tr, th, td {
  border: 1px solid black;
  border-collapse: collapse;
  padding: 6px 12px;
}
.addPermission {
  display: block;
  margin: 0 auto 10px;
}

/* 弹窗样式（与用户管理完全一致） */
.modal-mask {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}
.modal-box {
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  min-width: 450px;
}
.form-item {
  margin: 12px 0;
}
.form-item label {
  display: inline-block;
  width: 90px;
}
.modal-buttons {
  margin-top: 20px;
  text-align: right;
}
.modal-buttons button {
  margin-left: 8px;
}
input, select {
  padding: 4px 8px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}
</style>