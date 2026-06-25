<script setup lang="ts">

import ChildCom from "@/ChildCom.vue";
import {ref} from "vue";

const a = ref();
const b=  ref();
const test=(param1:any, param2:any)=>{
  console.log("父组件中的test: ",param1,param2)
  a.value=param1
  b.value=param2
}
</script>

<template>
 我是父组件{{a}}.{{b}}
  <child-com @node-change="test"></child-com>
</template>

<style scoped>

</style>