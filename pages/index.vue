<template>
  <div class="min-h-screen   flex items-center justify-center">
    <AppLoader size="lg" color="indigo" class="inline-block" />
  </div>
</template>

<script setup>
import { onMounted } from 'vue';

onMounted(() => {
  const token = localStorage.getItem('ticketr_admin_token');
  if (token) {
    useRouter().push('/dashboard');
  } else {
    useRouter().push('/login');
  }
});
</script>
