<template>
  <div class="min-h-screen   flex flex-col">
    <!-- Top Header -->
    <header class="glass-card border-b border-gray-200 px-6 py-4">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <div class="flex items-center space-x-6">
          <NuxtLink to="/" class="flex items-center space-x-3">
            <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center font-bold text-lg text-gray-900">
              ⚡
            </div>
            <span class="font-bold text-lg text-gray-900">Ticketr Admin</span>
          </NuxtLink>

          <nav class="hidden md:flex items-center space-x-4 text-xs font-semibold">
            <NuxtLink to="/dashboard" class="text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg">Dashboard</NuxtLink>
            <NuxtLink to="/dashboard/events" class="text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg">Events Management</NuxtLink>
            <NuxtLink to="/dashboard/orders" class="bg-primary text-white px-3 py-1.5 rounded-lg">Orders & Financials</NuxtLink>
            <NuxtLink to="/dashboard/scanner" class="text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg">Gate Scanner</NuxtLink>
            <NuxtLink to="/dashboard/settings" class="text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg">Branding & Payouts</NuxtLink>
          </nav>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-6 py-8 flex-grow w-full space-y-6">
      <div>
        <h1 class="text-2xl font-extrabold text-gray-900">Orders & Financial Transactions</h1>
        <p class="text-xs text-gray-600 mt-1">Audit ticket purchases, Paystack transaction references, and revenue logs.</p>
      </div>

      <!-- Orders Table -->
      <div class="glass-card rounded-2xl p-6">
        <div v-if="loading" class="text-center py-12 text-gray-500 text-sm">
          Loading orders...
        </div>

        <div v-else-if="orders.length === 0" class="text-center py-12 text-gray-500 text-sm">
          No orders placed yet.
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full text-left text-sm text-gray-700">
            <thead class="/60 text-xs uppercase text-gray-600 border-b border-gray-200">
              <tr>
                <th class="py-3 px-4">Order Number</th>
                <th class="py-3 px-4">Customer Name</th>
                <th class="py-3 px-4">Event</th>
                <th class="py-3 px-4">Amount</th>
                <th class="py-3 px-4">Paystack Ref</th>
                <th class="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/60">
              <tr v-for="o in orders" :key="o._id" class="hover:/40 transition">
                <td class="py-4 px-4 font-mono text-xs text-primary">{{ o.orderNumber }}</td>
                <td class="py-4 px-4 font-semibold text-gray-900">
                  {{ o.customerName }}
                  <span class="block text-xs text-gray-500 font-normal">{{ o.customerEmail }}</span>
                </td>
                <td class="py-4 px-4 text-xs text-gray-700">{{ o.eventId?.title || 'Event' }}</td>
                <td class="py-4 px-4 font-extrabold text-gray-900">₦{{ o.totalAmount?.toLocaleString() }}</td>
                <td class="py-4 px-4 font-mono text-xs text-gray-600">{{ o.paystackReference }}</td>
                <td class="py-4 px-4">
                  <span
                    :class="o.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'"
                    class="px-2.5 py-1 rounded-full text-[11px] font-semibold border"
                  >
                    {{ o.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const config = useRuntimeConfig();

const orders = ref([]);
const loading = ref(true);

async function loadOrders() {
  const token = localStorage.getItem('ticketr_admin_token');
  if (!token) return;

  loading.value = true;
  try {
    const res = await fetch(`${config.public.apiBase}/orders/tenant`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      orders.value = await res.json();
    }
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadOrders();
});
</script>
