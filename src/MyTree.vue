<script setup lang="ts">

import {computed} from "vue";
import type {Permission} from "@/RoleManager.vue";

const props=defineProps({
  item:{
    type:Object,
    required:true
  }
})

  const typeClass=computed(()=>{
    return `type-${props.item.menuType.toLowerCase()}`
  })
const typeName2Chinese=computed(()=>{
  switch (props.item.menuType){
    case 'DIRECTORY' :return '目录'
    case 'MENU' :return '菜单'
    case 'BUTTON' :return '按钮'
    default:return '未知'
  }
})
const emit=defineEmits(['node-change'])
const handleChange=(e: Event)=>{
  //如何知道自己勾选的是哪个
  emit('node-change',props.item,(e.target as HTMLInputElement)?.checked)
}
const handleChildChange=(node:Permission,isChecked:boolean)=>{
  emit('node-change',node,isChecked)
}
</script>

<template>
  <div class=menu-content>
    <input type="checkbox"
           v-model="props.item.checked"
           .indeterminate="item.halfChecked"
           @change="handleChange"
    >

    <span>{{item.name}}</span>

    <span class="item-type" :class="typeClass">{{typeName2Chinese}}</span>

    <div class="children" v-if="item.children &&item.children.length>0">
      <MyTree v-for="subItem in item.children" :key="subItem.id" :item="subItem" @node-change="handleChildChange"/>
    </div>
  </div>
</template>

<style scoped>
  .menu-content{
    margin-bottom: 3px;
  }
  .menu-content .children{
    margin-top: 3px;
  }
  .children{
    padding-left: 20px;
  }
  .item-type{
    float: right;
  }
  .type-directory{
    color: #5cbbff;
    background-color: #90fff7;
  }
  .type-menu{
    color: #71ff4c;
    background-color: #cbffbd;
  }
  .type-button{
    color: #ffc162;
    background-color: #ffe69f;
  }
</style>