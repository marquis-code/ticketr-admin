<template>
  <Toaster position="top-right" richColors />
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
import '~/assets/css/main.css';
import { Toaster } from 'vue-sonner';
</script>
