<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getAllUser, addUser, updateUser, deleteUser } from '@/http/user.ts'
import { getRoleList, type Role } from '@/http/role.ts'

const userList = ref<any[]>([])
const roleList = ref<Role[]>([])

const fetchUserList = async () => {
  try {
    const res = await getAllUser()
    userList.value = res.data || res
  } catch (error) {
    console.error('获取用户数据失败', error)
  }
}

const fetchRoleList = async () => {
  try {
    const res = await getRoleList()
    roleList.value = res.data || res
  } catch (error) {
    console.error('获取角色列表失败', error)
  }
}
onMounted(() => {
  fetchUserList()
  fetchRoleList()
})

const dialogVisible = ref(false)
const isEdit = ref(false)
const currentEditId = ref<number | null>(null)

const form = ref({
  username: '',
  password: '',
  roleId: null as number | null
})

const openAddDialog = () => {
  isEdit.value = false
  currentEditId.value = null
  form.value = { username: '', password: '', roleId: null }
  dialogVisible.value = true
}

const openEditDialog = (user: any) => {
  isEdit.value = true
  currentEditId.value = user.id
  form.value = {
    username: user.username,
    password: '',
    roleId: user.roleId || null
  }
  dialogVisible.value = true
}

const handleSubmit = async () => {
  if (!form.value.username) {
    alert('请输入用户名')
    return
  }
  try {
    if (isEdit.value && currentEditId.value !== null) {
      await updateUser(currentEditId.value, form.value)
    } else {
      // 新增用户：密码为空则默认设为 '12345'
      if (!form.value.password) {
        form.value.password = '12345'
      }
      await addUser(form.value)
    }
    dialogVisible.value = false
    fetchUserList()
  } catch (error) {
    console.error('操作失败', error)
    alert('操作失败，请稍后重试')
  }
}

const handleDelete = async (id: number) => {
  if (!confirm('确定要删除该用户吗？')) return
  try {
    await deleteUser(id)
    fetchUserList()
  } catch (error) {
    console.error('删除失败', error)
    alert('删除失败')
  }
}
</script>

<template>
  <div>
    <table>
      <tr>
        <th>用户id</th>
        <th>用户名</th>
        <th>用户密码</th>
        <th>操作</th>
      </tr>
      <tr v-for="user in userList" :key="user.id">
        <td>{{ user.id }}</td>
        <td>{{ user.username }}</td>
        <td>{{ user.password }}</td>
        <td>
          <button @click="openEditDialog(user)">管理</button>
          <button @click="handleDelete(user.id)">删除</button>
        </td>
      </tr>
    </table>

    <div style="margin-top: 10px;">
      <button @click="openAddDialog">添加用户</button>
    </div>

    <div v-if="dialogVisible" class="modal-mask">
      <div class="modal-box">
        <h3>{{ isEdit ? '编辑用户' : '新增用户' }}</h3>
        <form @submit.prevent="handleSubmit">
          <div class="form-item">
            <label>用户名：</label>
            <input v-model="form.username" type="text" required />
          </div>
          <div class="form-item">
          <label>密　码：</label>
          <!-- 移除 :required="!isEdit" -->
          <input v-model="form.password" type="text" />
          <span v-if="isEdit" style="color: #999; font-size: 12px;">（留空则不修改密码）</span>
        </div>
          <div class="form-item">
            <label>角色身份：</label>
            <select v-model="form.roleId">
              <option :value="null">未选择</option>
              <option v-for="role in roleList" :key="role.id" :value="role.id">
                {{ role.name }}
              </option>
            </select>
          </div>
          <div class="modal-buttons">
            <button type="submit">保存</button>
            <button type="button" @click="dialogVisible = false">取消</button>
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
.modal-mask {
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.4);
  display: flex; align-items: center; justify-content: center;
  z-index: 100;
}
.modal-box {
  background: #fff; padding: 24px; border-radius: 8px; min-width: 360px;
}
.form-item {
  margin: 12px 0;
}
.form-item label {
  display: inline-block; width: 70px;
}
.modal-buttons {
  margin-top: 20px; text-align: right;
}
.modal-buttons button {
  margin-left: 8px;
}
</style>