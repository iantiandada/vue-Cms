<script setup lang="ts">
import { onMounted, ref } from "vue"
import {
  addRole,
  authorizeRole,
  deleteRole,
  getAllPermission,
  getPermissionOfCurrentRole,
  getRoleList,
  type Role
} from "@/http/role.ts"
import MyTree from "@/MyTree.vue"

export interface Permission {
  id: number
  name: string
  menuType: string
  checked: boolean
  parent?: Permission
  children: Permission[]
  halfChecked: boolean
  menuGranted?: boolean
}

const roleList = ref<Role[]>([])
const allPermission = ref<Permission[]>([])
const currentRoleId = ref<number | null>(null)
const saving = ref(false)
const showAddDialog = ref(false)
const newRoleName = ref('')

// 打开添加对话框
const roleAdd = () => {
  newRoleName.value = ''
  showAddDialog.value = true
}
const submitRoleAdd = async () => {
  if (!newRoleName.value.trim()) {
    alert('请输入角色名称')
    return
  }
  try {
    await addRole({ roleName: newRoleName.value })
    showAddDialog.value = false
    // 刷新角色列表
    roleList.value = await getRoleList()
    alert('添加成功')
  } catch (error) {
    console.error('添加失败', error)
    alert('添加失败')
  }
}

const roleDelete = async (id: number) => {
  if (!confirm('确定要删除该角色吗？')) return
  try {
    await deleteRole(id)
    roleList.value = await getRoleList() // 刷新列表
  } catch (error) {
    console.error('删除失败', error)
    alert('删除失败')
  }
}

onMounted(async () => {
  roleList.value = await getRoleList()
})

// 打开授权对话框
const openAuthDialog = async (roleId: number) => {
  currentRoleId.value = roleId
  const rolePermissionIds = await getPermissionOfCurrentRole(roleId)
  allPermission.value = await getAllPermission()
  initMenuState(allPermission.value)
  checkExistingPermissions(allPermission.value, rolePermissionIds)
  calculateParentStatus(allPermission.value)
  isHide.value = false
}

// 前序遍历更新父节点状态
const updateParentStatus = (parentNode: Permission | undefined) => {
  if (!parentNode) return
  let allChecked = parentNode.children.every(child => child.checked)
  let hasChecked = parentNode.children.some(child => child.checked || child.halfChecked)
  parentNode.checked = allChecked
  parentNode.halfChecked = !allChecked && hasChecked
  if (!allChecked && !hasChecked && parentNode.menuGranted) {
    parentNode.checked = false
    parentNode.halfChecked = true
  }
  updateParentStatus(parentNode.parent)
}

// 后续遍历初始化父节点状态
const calculateParentStatus = (allPermission: Permission[]) => {
  allPermission.forEach(node => {
    if (node.children && node.children.length > 0) {
      calculateParentStatus(node.children)
      let allChecked = node.children.every(child => child.checked)
      let hasChecked = node.children.some(child => child.checked || child.halfChecked)
      node.checked = allChecked
      node.halfChecked = !allChecked && hasChecked
      if (!allChecked && !hasChecked && node.menuGranted) {
        node.checked = false
        node.halfChecked = true
      }
    }
  })
}

// 已有权限打勾
const checkExistingPermissions = (allPermission: Permission[], rolePermissionIds: number[]) => {
  allPermission.forEach(item => {
    if (rolePermissionIds.includes(item.id)) {
      item.checked = true
      item.menuGranted = true
    }
    if (item.children && item.children.length > 0) {
      checkExistingPermissions(item.children, rolePermissionIds)
    }
  })
}

// 初始化菜单状态，设置父节点引用
const initMenuState = (treeData: Permission[], parentNode?: Permission) => {
  treeData.forEach((menu) => {
    menu.checked = false
    menu.halfChecked = false
    menu.parent = parentNode
    if (menu.children) {
      initMenuState(menu.children, menu)
    }
  })
}

// 关闭对话框
const closeAuthDialog = () => {
  isHide.value = true
}

const isHide = ref(true)

// 树节点勾选变化
const onNodeChange = (node: Permission, isChecked: boolean) => {
  updateChildState(node, isChecked)
  updateParentStatus(node.parent)
}

// 递归更新子节点状态
const updateChildState = (node: Permission, isChecked: boolean) => {
  node.checked = isChecked
  node.halfChecked = false
  if (!isChecked) {
    node.menuGranted = false
  }
  if (node.children && node.children.length > 0) {
    node.children.forEach(child => {
      updateChildState(child, isChecked)
    })
  }
}

// 收集所有选中的权限ID
const collectCheckedIds = (nodes: Permission[]): number[] => {
  const ids: number[] = []
  nodes.forEach(node => {
    if (node.checked) ids.push(node.id)
    if (node.children) ids.push(...collectCheckedIds(node.children))
  })
  return ids
}

// 保存授权
const saveAuth = async () => {
  if (!currentRoleId.value) return
  const permissionIds = collectCheckedIds(allPermission.value)
  saving.value = true
  try {
    await authorizeRole({
      roleId: currentRoleId.value,
      permissionIds
    })
    isHide.value = true
    alert('授权保存成功')
  } catch (err) {
    console.error('保存失败', err)
    alert('保存失败')
  } finally {
    saving.value = false
  }
}
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
        <button @click="openAuthDialog(role.id)">权限管理</button>
        <button @click="roleDelete(role.id)">删除角色</button>
      </td>
    </tr>
  </table>
  <div><button @click="roleAdd">添加角色</button></div>
  <!-- 添加角色 -->
  <div v-if="showAddDialog" class="modal-mask" @click.self="showAddDialog = false">
    <div class="modal-box">
      <span class="rbac-modal-close" @click="showAddDialog = false">&times;</span>
      <h2>添加角色</h2>
      <form @submit.prevent="submitRoleAdd">
        <div style="margin: 16px 0;">
          <label>角色名称：</label>
          <input v-model="newRoleName" type="text" required placeholder="请输入角色名称" />
        </div>
        <div class="modal-buttons">
          <button type="button" @click="showAddDialog = false">取消</button>
          <button type="submit">保存</button>
        </div>
      </form>
    </div>
  </div>

  <!-- 遮罩层 -->
  <div class="modal-mask" :class="{ modelHide: isHide }" @click.self="closeAuthDialog">
    <div class="modal-box">
      <!-- 关闭按钮 -->
      <span class="rbac-modal-close" @click="closeAuthDialog">&times;</span>

      <!-- 标题 -->
      <h2>角色授权</h2>

      <!-- 可滚动的权限树区域 -->
      <div class="tree-scroll-area">
        <my-tree
            v-for="menu in allPermission"
            :key="menu.id"
            :item="menu"
            @node-change="onNodeChange"
        />
      </div>

      <!-- 底部按钮区 -->
      <div class="modal-buttons">
        <button @click="saveAuth" :disabled="saving">
          {{ saving ? '保存中...' : '保存' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 表格 */
table,
tr,
th,
td {
  border: 1px solid black;
  border-collapse: collapse;
  padding: 6px 12px;
}

/* 遮罩层 */
.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

/* 弹窗内容 */
.modal-box {
  position: relative; /* 为关闭按钮提供定位参考 */
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  min-width: 360px;
  max-width: 640px;
  width: 90%;
}

/* 关闭按钮 */
.rbac-modal-close {
  position: absolute;
  top: 12px;
  right: 16px;
  cursor: pointer;
  font-size: 22px;
  color: #999;
  line-height: 1;
}

.rbac-modal-close:hover {
  color: #333;
}

/* 树区域滚动 */
.tree-scroll-area {
  max-height: 400px;
  overflow-y: auto;
  margin: 16px 0;
}

/* 底部按钮区 */
.modal-buttons {
  margin-top: 20px;
  text-align: right;
}

.modal-buttons button {
  margin-left: 8px;
}

/* 隐藏类 */
.modelHide {
  display: none;
}
</style>