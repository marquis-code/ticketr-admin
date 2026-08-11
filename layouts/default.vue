<template>
  <div class="min-h-screen flex bg-gray-50">
    <!-- Mobile Sidebar Backdrop -->
    <div v-if="isSidebarOpen" @click="isSidebarOpen = false" class="fixed inset-0 bg-gray-900/50 z-40 lg:hidden"></div>

    <!-- Sidebar -->
    <aside :class="['fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out', isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0']">
      <div class="p-6 border-b border-gray-200 flex items-center justify-between">
        <NuxtLink to="/dashboard" class="flex items-center space-x-3">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center font-bold text-lg text-gray-900">
            ⚡
          </div>
          <span class="font-bold text-lg text-gray-900">Ticketr Admin</span>
        </NuxtLink>
        <button @click="isSidebarOpen = false" class="lg:hidden text-gray-500 hover:text-gray-700">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <nav class="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        <NuxtLink to="/dashboard" class="nav-link" active-class="nav-link-active" exact-active-class="nav-link-active">
          Dashboard
        </NuxtLink>
        <NuxtLink to="/dashboard/events" class="nav-link" active-class="nav-link-active">
          Events Management
        </NuxtLink>
        <NuxtLink to="/dashboard/orders" class="nav-link" active-class="nav-link-active">
          Orders & Financials
        </NuxtLink>
        <NuxtLink to="/dashboard/scanner" class="nav-link" active-class="nav-link-active">
          Gate Scanner
        </NuxtLink>
        <NuxtLink to="/dashboard/settings" class="nav-link" active-class="nav-link-active">
          Branding & Payouts
        </NuxtLink>
      </nav>

      <div class="p-4 border-t border-gray-200">
        <div class="text-xs text-gray-500 font-medium mb-3 truncate">{{ user?.email || 'Logged In' }}</div>
        <button @click="showLogoutModal = true" class="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors">
          Logout
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <!-- Mobile Header -->
      <header class="lg:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-30">
        <button @click="isSidebarOpen = true" class="text-gray-600 hover:text-gray-900">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
        <span class="font-bold text-gray-900">Ticketr</span>
        <div class="w-6"></div> <!-- spacer -->
      </header>

      <main class="flex-1 overflow-y-auto">
        <slot />
      </main>
    </div>

    <!-- Logout Modal -->
    <div v-if="showLogoutModal" class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
      <div class="bg-white border border-gray-200 w-full max-w-sm p-6 rounded-2xl relative shadow-xl">
        <h3 class="text-lg font-bold text-gray-900 mb-2">Confirm Logout</h3>
        <p class="text-sm text-gray-500 mb-6">Are you sure you want to sign out of your account?</p>
        <div class="flex justify-end gap-3">
          <button @click="showLogoutModal = false" class="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition">Cancel</button>
          <button @click="confirmLogout" class="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition">Yes, Logout</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const isSidebarOpen = ref(false);
const showLogoutModal = ref(false);
const user = ref(null);
const router = useRouter();
const route = useRoute();

onMounted(() => {
  if (import.meta.client) {
    user.value = JSON.parse(localStorage.getItem('ticketr_admin_user') || '{}');
  }
});

// Close sidebar on route change on mobile
watch(() => route.path, () => {
  isSidebarOpen.value = false;
});

function confirmLogout() {
  if (import.meta.client) {
    localStorage.removeItem('ticketr_admin_token');
    localStorage.removeItem('ticketr_admin_user');
  }
  router.push('/login');
}
</script>

<style scoped>
.nav-link {
  @apply block px-4 py-2.5 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors;
}
.nav-link-active {
  @apply bg-indigo-50 text-indigo-700;
}
</style>
