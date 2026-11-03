<template>
  <div class="min-h-screen bg-paper flex items-center justify-center">
    <div class="w-8 h-8 rounded-full border-4 border-line border-t-forest animate-spin" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
onMounted(() => {
  const token = localStorage.getItem('ticketr_admin_token');
  navigateTo(token ? '/admin/dashboard' : '/admin/login', { replace: true });
});
</script>
