<script setup lang="ts">
import {computed} from "vue";

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})
const typeName2Chinese = computed(() => {
  switch (props.item.menuType) {
    case 'DIRECTORY':
      return '目录';
    case 'MENU':
      return '菜单';
    case 'BUTTON':
      return '按钮'
    default:
      return '未知'
  }
})
const typeClass = computed(() => {
  return `type-${props.item.menuType.toLowerCase()}`
})
</script>

<template>
  <div class="menu-content">
    <input type="checkbox" :checked="item.checked">
    <span>{{ props.item.name }}</span>
    <span class="item-type" :class="typeClass">{{ typeName2Chinese }}</span>
    <div class="children" v-if="item.children && item.children.length>0">
      <MyMenuItem v-for="subItem in item.children" :key="subItem.id" :item="subItem"/>
    </div>
  </div>
</template>

<style scoped>
.menu-content {
  margin-bottom: 5px;
}

.menu-content .children {
  margin-top: 5px;
}

.children {
  padding-left: 20px;
}

.item-type {
  float: right;
  display: inline-block;
}

.type-directory {
  color: #569EFA;
  background-color: #EEF5FE;
}

.type-menu {
  color: #7ABF4A;
  background-color: #F2F9EC;
}

.type-button {
  color: #DEA44C;
  background-color: #FCF6ED;
}

</style>