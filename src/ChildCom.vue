<script setup lang="ts">

  const emit=defineEmits(['node-change'])

  const sendData2Parent=()=>{
    emit('node-change','abc','cde')
  }
</script>

<template>
  <div>
    <button @click="sendData2Parent">传递数据给父组件</button>
  </div>
</template>

<style scoped>

</style>