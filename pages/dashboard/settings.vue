<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
    <header class="glass-card border-b border-slate-800 px-6 py-4">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <div class="flex items-center space-x-6">
          <NuxtLink to="/" class="flex items-center space-x-3">
            <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center font-bold text-lg text-white">
              ⚡
            </div>
            <span class="font-bold text-lg text-white">CMultiTickets Admin</span>
          </NuxtLink>

          <nav class="hidden md:flex items-center space-x-4 text-xs font-semibold">
            <NuxtLink to="/dashboard" class="text-slate-400 hover:text-white px-3 py-1.5 rounded-lg">Dashboard</NuxtLink>
            <NuxtLink to="/dashboard/events" class="text-slate-400 hover:text-white px-3 py-1.5 rounded-lg">Events Management</NuxtLink>
            <NuxtLink to="/dashboard/orders" class="text-slate-400 hover:text-white px-3 py-1.5 rounded-lg">Orders & Financials</NuxtLink>
            <NuxtLink to="/dashboard/scanner" class="text-slate-400 hover:text-white px-3 py-1.5 rounded-lg">Gate Scanner</NuxtLink>
            <NuxtLink to="/dashboard/settings" class="bg-indigo-600 text-white px-3 py-1.5 rounded-lg">Branding & Payouts</NuxtLink>
          </nav>
        </div>
      </div>
    </header>

    <main class="max-w-4xl mx-auto px-6 py-8 flex-grow w-full space-y-6">
      <div>
        <h1 class="text-2xl font-extrabold text-white">Organization Settings</h1>
        <p class="text-xs text-slate-400 mt-1">Configure your organization's custom branding colors, logo, and Paystack payout settings.</p>
      </div>

      <div class="glass-card rounded-2xl p-8 border-indigo-500/30">
        <form @submit.prevent="saveSettings" class="space-y-6">
          <div>
            <label class="block text-xs font-medium text-slate-400 mb-1">Organization Name</label>
            <input
              v-model="form.name"
              type="text"
              required
              class="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-400 mb-1">Contact Email</label>
            <input
              v-model="form.contactEmail"
              type="email"
              required
              class="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-medium text-slate-400 mb-1">Primary Color (Hex)</label>
              <div class="flex items-center gap-3">
                <input v-model="form.primaryColor" type="color" class="w-10 h-10 rounded bg-transparent cursor-pointer border-0" />
                <input v-model="form.primaryColor" type="text" class="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white" />
              </div>
            </div>

            <div>
              <label class="block text-xs font-medium text-slate-400 mb-1">Secondary Color (Hex)</label>
              <div class="flex items-center gap-3">
                <input v-model="form.secondaryColor" type="color" class="w-10 h-10 rounded bg-transparent cursor-pointer border-0" />
                <input v-model="form.secondaryColor" type="text" class="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white" />
              </div>
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-400 mb-1">Paystack Subaccount Code (Split Payouts)</label>
            <input
              v-model="form.paystackSubaccountCode"
              type="text"
              placeholder="ACCT_xxxxxx"
              class="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-indigo-500"
            />
            <span class="text-[11px] text-slate-500 block mt-1">Ticket sales revenue will automatically split & deposit to this subaccount.</span>
          </div>

          <div class="pt-4 flex justify-end">
            <button type="submit" :disabled="saving" class="btn-primary text-xs !py-2.5 !px-6">
              {{ saving ? 'Saving Changes...' : 'Save Settings' }}
            </button>
          </div>
        </form>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const config = useRuntimeConfig();

const saving = ref(false);
const tenantId = ref('');
const form = ref({
  name: '',
  contactEmail: '',
  primaryColor: '#4f46e5',
  secondaryColor: '#0f172a',
  paystackSubaccountCode: '',
});

async function loadTenantSettings() {
  const token = localStorage.getItem('cmt_token');
  if (!token) return;
  const user = JSON.parse(localStorage.getItem('cmt_user') || '{}');
  if (!user.tenantId) return;
  tenantId.value = user.tenantId;

  try {
    const res = await fetch(`${config.public.apiBase}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      if (data.tenant) {
        form.value.name = data.tenant.name || '';
        form.value.contactEmail = data.tenant.contactEmail || '';
        form.value.primaryColor = data.tenant.primaryColor || '#4f46e5';
        form.value.secondaryColor = data.tenant.secondaryColor || '#0f172a';
        form.value.paystackSubaccountCode = data.tenant.paystackSubaccountCode || '';
      }
    }
  } catch (err) {
    console.error(err);
  }
}

async function saveSettings() {
  const token = localStorage.getItem('cmt_token');
  if (!token || !tenantId.value) return;

  saving.value = true;
  try {
    const res = await fetch(`${config.public.apiBase}/tenants/${tenantId.value}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form.value),
    });
    if (res.ok) {
      alert('Settings saved successfully!');
    }
  } catch (e) {
    alert('Failed to save settings');
  } finally {
    saving.value = false;
  }
}

onMounted(() => {
  loadTenantSettings();
});
</script>
