
<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '@/http/user.ts'
import { userStore } from '@/store/userStore'

const loginForm = ref({
  username: '',
  password: ''
})
const errorMsg = ref('')
const router = useRouter()

const handleLogin = async () => {
  try {
    const res = await login(loginForm.value)
    // 后端现在返回 { code: 200, data: { user: {...}, permissionIds: [...] } }
    if (res.code === 200) {
      const { permissionIds, user } = res.data
      userStore.setPermission(permissionIds, user.username)
      router.push({ path: '/aside', query: { auth: '1' } })
    } else {
      errorMsg.value = res.message || '登录失败'
    }
  } catch (error) {
    console.error('登录请求失败', error)
    errorMsg.value = '网络错误，请稍后重试'
  }
}
</script>

<template>
  <div class="login-container">
    <h2 class="loginWord">登录</h2>
    <form @submit.prevent="handleLogin">
      <div class="form-item">
        <label>用户名：</label>
        <input v-model="loginForm.username" type="text" required />
      </div>
      <div class="form-item">
        <label>密　码：</label>
        <input v-model="loginForm.password" type="password" required />
      </div>
      <div class="form-item">
        <button type="submit">登录</button>
      </div>
    </form>
    <p v-if="errorMsg" style="color: red;">{{ errorMsg }}</p>
  </div>
</template>

<style scoped>
.loginWord{
  padding-left: 125px;
}
.login-container {
  width: 300px;
  margin: 100px auto;
  padding: 30px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: #f9f9f9;
}
.form-item {
  margin: 10px 0;
}
.form-item label {
  display: inline-block;
  width: 70px;
}
button {
  width: 100%;
  padding: 8px;
  background: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>