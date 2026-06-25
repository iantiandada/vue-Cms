<template>
  <div>
    <div v-for="item in data" :key="item.id">
      <div
          class="menu-item"
          :class="{ 'child-item': level > 0 }"
          :style="{ paddingLeft: (level * 10 + 12) + 'px' }"
          @click="$emit('select', item)"
      >
        {{ item.name }}
      </div>
      <MenuTree
          v-if="item.children && item.children.length"
          :data="item.children"
          :level="level + 1"
          @select="$emit('select', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  data: any[]
  level?: number
}>(), {
  level: 0
})

defineEmits(['select'])
</script>

<style scoped>
.menu-item {
  cursor: pointer;
  padding: 8px 0;
  color: #333;
  border-radius: 4px;
  transition: background 0.2s;
}
.menu-item:hover {
  background: #f0f0f0;
}
.child-item {
  color: #888;
}
</style>