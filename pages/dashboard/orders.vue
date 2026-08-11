<template>
  <div class="min-h-screen   flex flex-col">
    <header class="glass-card border-b border-gray-200 px-4 md:px-6 py-4">
      <div class="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 w-full md:w-auto">
          <NuxtLink to="/" class="flex items-center space-x-3">
            <img v-if="tenantLogo" :src="tenantLogo" alt="Logo" class="w-9 h-9 rounded-xl object-cover border border-gray-200" />
            <div v-else class="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center font-bold text-lg text-gray-900">
              ⚡
            </div>
            <span class="font-bold text-lg text-gray-900">{{ tenantName || 'Ticketr Admin' }}</span>
          </NuxtLink>

          <nav class="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide text-xs font-semibold">
            <NuxtLink to="/dashboard" class="text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg">Dashboard</NuxtLink>
            <NuxtLink to="/dashboard/events" class="text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg">Events Management</NuxtLink>
            <NuxtLink to="/dashboard/orders" class="bg-primary text-white px-3 py-1.5 rounded-lg">Orders & Financials</NuxtLink>
            <NuxtLink to="/dashboard/scanner" class="text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg">Gate Scanner</NuxtLink>
            <NuxtLink to="/dashboard/settings" class="text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg">Branding & Payouts</NuxtLink>
          </nav>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 md:px-6 py-8 flex-grow w-full space-y-6">
      <div>
        <h1 class="text-2xl font-extrabold text-gray-900">Orders & Financial Transactions</h1>
        <p class="text-xs text-gray-600 mt-1">Audit ticket purchases, Paystack transaction references, and revenue logs.</p>
      </div>

      <!-- Filters -->
      <div class="flex gap-2 border-b border-gray-200 pb-2">
        <button @click="currentTab = 'ALL'" :class="currentTab === 'ALL' ? 'text-indigo-600 border-b-2 border-indigo-600 font-bold' : 'text-gray-500'" class="px-4 py-2 text-sm">All Orders</button>
        <button @click="currentTab = 'AWAITING_APPROVAL'" :class="currentTab === 'AWAITING_APPROVAL' ? 'text-indigo-600 border-b-2 border-indigo-600 font-bold' : 'text-gray-500'" class="px-4 py-2 text-sm flex items-center gap-2">
          Pending Approvals
          <span v-if="pendingCount > 0" class="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{{ pendingCount }}</span>
        </button>
      </div>

      <!-- Orders Table -->
      <div class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div v-if="loading" class="text-center py-12 text-gray-500 text-sm">
          Loading orders...
        </div>

        <div v-else-if="filteredOrders.length === 0" class="text-center py-12 text-gray-500 text-sm">
          No orders found in this category.
        </div>

        <div v-else class="overflow-x-auto border border-gray-200 rounded-xl bg-white shadow-sm">
          <table class="w-full text-left border-collapse whitespace-nowrap">
            <thead class="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
              <tr>
                <th class="py-4 px-4 md:px-6">Customer & Order</th>
                <th class="py-4 px-4 md:px-6">Event</th>
                <th class="py-4 px-4 md:px-6">Amount</th>
                <th class="py-4 px-4 md:px-6">Reference</th>
                <th class="py-4 px-4 md:px-6 text-right">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 bg-white">
              <tr v-for="o in filteredOrders" :key="o._id" class="hover:bg-gray-50 transition-colors duration-150">
                <td class="px-6 py-4 md:px-6">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
                      {{ o.customerName.charAt(0).toUpperCase() }}
                    </div>
                    <div>
                      <p class="font-bold text-gray-900 text-sm">{{ o.customerName }}</p>
                      <p class="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                        <span class="font-mono text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">{{ o.orderNumber }}</span>
                        {{ o.customerEmail }}
                      </p>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 md:px-6">
                  <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-50 border border-gray-100 text-xs font-medium text-gray-700">
                    🎪 {{ o.eventId?.title || 'Unknown Event' }}
                  </div>
                </td>
                <td class="px-6 py-4 md:px-6">
                  <span class="font-extrabold text-gray-900 text-sm">₦{{ o.totalAmount?.toLocaleString() }}</span>
                </td>
                <td class="px-6 py-4 md:px-6">
                  <div class="flex items-center gap-2">
                    <span class="font-mono text-[11px] text-gray-500 truncate max-w-[120px]" :title="o.paystackReference">
                      {{ o.paystackReference }}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 md:px-6 text-right">
                  <span
                    :class="{
                      'bg-emerald-50 text-emerald-700 border-emerald-200': o.status === 'PAID',
                      'bg-amber-50 text-amber-700 border-amber-200': o.status === 'PENDING',
                      'bg-orange-50 text-orange-700 border-orange-200': o.status === 'AWAITING_APPROVAL',
                      'bg-red-50 text-red-700 border-red-200': o.status === 'FAILED' || o.status === 'CANCELLED'
                    }"
                    class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border shadow-sm"
                  >
                    {{ o.status }}
                  </span>
                  
                  <div v-if="o.status === 'AWAITING_APPROVAL' && o.proofOfPaymentUrl" class="mt-2 flex justify-end gap-2">
                    <button @click="viewReceipt(o.proofOfPaymentUrl)" class="text-xs text-indigo-600 hover:underline">View Receipt</button>
                    <button @click="approveOrder(o._id)" :disabled="actioning === o._id" class="text-xs bg-emerald-500 text-white px-2 py-1 rounded">Approve</button>
                    <button @click="rejectOrder(o._id)" :disabled="actioning === o._id" class="text-xs bg-red-500 text-white px-2 py-1 rounded">Reject</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>

    <!-- Receipt Modal -->
    <div v-if="showingReceipt" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click.self="closeReceipt">
      <div class="bg-white rounded-xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col h-[80vh]">
        <div class="p-4 border-b flex justify-between items-center bg-gray-50 shrink-0">
          <h3 class="font-bold">Proof of Payment</h3>
          <button @click="closeReceipt" class="text-gray-500 font-bold hover:text-black">&times;</button>
        </div>
        <div class="p-4 flex-grow overflow-auto flex justify-center bg-gray-100">
          <iframe v-if="isPdf(receiptUrl)" :src="receiptUrl" class="w-full h-full border-0" frameborder="0"></iframe>
          <img v-else :src="receiptUrl" alt="Receipt" class="max-w-full object-contain" />
        </div>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <div v-if="confirmModal.show" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div class="bg-white border border-gray-200 w-full max-w-sm p-6 rounded-2xl shadow-xl">
        <h3 class="text-lg font-bold text-gray-900 mb-2">{{ confirmModal.title }}</h3>
        <p class="text-sm text-gray-500 mb-6">{{ confirmModal.message }}</p>
        <div class="flex justify-end gap-3">
          <button @click="confirmModal.show = false" class="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition">Cancel</button>
          <button @click="confirmModal.onConfirm(); confirmModal.show = false" class="px-4 py-2 text-sm font-semibold text-white rounded-lg transition" :class="confirmModal.variant === 'danger' ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700'">{{ confirmModal.confirmText }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { toast } from 'vue-sonner';

const config = useRuntimeConfig();

const orders = ref([]);
const loading = ref(true);
const actioning = ref(null);
const tenantLogo = ref('');
const tenantName = ref('');
const currentTab = ref('ALL');

const pendingCount = computed(() => orders.value.filter(o => o.status === 'AWAITING_APPROVAL').length);

const filteredOrders = computed(() => {
  if (currentTab.value === 'ALL') return orders.value;
  return orders.value.filter(o => o.status === currentTab.value);
});

// Modal state
const showingReceipt = ref(false);
const receiptUrl = ref('');

const confirmModal = ref({
  show: false,
  title: '',
  message: '',
  confirmText: 'Confirm',
  variant: 'primary',
  onConfirm: () => {},
});

function showConfirm({ title, message, confirmText, variant, onConfirm }) {
  confirmModal.value = { show: true, title, message, confirmText: confirmText || 'Confirm', variant: variant || 'primary', onConfirm };
}

function viewReceipt(url) {
  receiptUrl.value = url;
  showingReceipt.value = true;
}

function closeReceipt() {
  showingReceipt.value = false;
  receiptUrl.value = '';
}

function isPdf(url) {
  if (!url) return false;
  return url.toLowerCase().includes('.pdf');
}

async function approveOrder(orderId) {
  showConfirm({
    title: 'Approve Payment',
    message: 'Are you sure you want to approve this payment and issue tickets? This action cannot be undone.',
    confirmText: 'Approve & Issue Tickets',
    variant: 'primary',
    onConfirm: async () => {
      const token = localStorage.getItem('ticketr_admin_token');
      actioning.value = orderId;
      try {
        const res = await fetch(`${config.public.apiBase}/orders/admin/${orderId}/approve`, {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          toast.success('Order approved successfully');
          loadOrders();
        } else {
          toast.error('Failed to approve order');
        }
      } catch (err) {
        toast.error('Error approving order');
      } finally {
        actioning.value = null;
      }
    }
  });
}

async function rejectOrder(orderId) {
  showConfirm({
    title: 'Reject Payment',
    message: 'Are you sure you want to reject this payment? The buyer will not receive their tickets.',
    confirmText: 'Reject Payment',
    variant: 'danger',
    onConfirm: async () => {
      const token = localStorage.getItem('ticketr_admin_token');
      actioning.value = orderId;
      try {
        const res = await fetch(`${config.public.apiBase}/orders/admin/${orderId}/reject`, {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          toast.success('Order rejected');
          loadOrders();
        } else {
          toast.error('Failed to reject order');
        }
      } catch (err) {
        toast.error('Error rejecting order');
      } finally {
        actioning.value = null;
      }
    }
  });
}

async function loadTenantDetails() {
  const token = localStorage.getItem('ticketr_admin_token');
  if (!token) return;
  try {
    const res = await fetch(`${config.public.apiBase}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      const data = await res.json();
      if (data.tenant) {
        tenantLogo.value = data.tenant.logoUrl;
        tenantName.value = data.tenant.name;
      }
    }
  } catch (err) {
    console.error(err);
  }
}

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
  loadTenantDetails();
  loadOrders();
});
</script>
