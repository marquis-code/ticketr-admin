<template>
  <div>
    <Toaster position="top-right" richColors />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
import '~/assets/css/main.css';
import { Toaster } from 'vue-sonner';
</script>
