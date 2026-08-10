<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
    <!-- Navbar -->
    <header class="glass-card border-b border-slate-800/80 px-6 py-4 sticky top-0 z-40">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <div class="flex items-center space-x-6">
          <NuxtLink to="/dashboard" class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-indigo-500/20">
              ⚡
            </div>
            <div>
              <span class="font-bold text-lg text-white block">Organizer Dashboard</span>
              <span class="text-xs text-indigo-400 font-medium">{{ user?.email || 'Logged In' }}</span>
            </div>
          </NuxtLink>

          <!-- Nav Tabs -->
          <nav class="hidden md:flex items-center space-x-4 text-xs font-semibold">
            <NuxtLink to="/dashboard" class="bg-indigo-600 text-white px-3 py-1.5 rounded-lg">Dashboard</NuxtLink>
            <NuxtLink to="/dashboard/events" class="text-slate-400 hover:text-white px-3 py-1.5 rounded-lg transition">Events Management</NuxtLink>
            <NuxtLink to="/dashboard/orders" class="text-slate-400 hover:text-white px-3 py-1.5 rounded-lg transition">Orders & Financials</NuxtLink>
            <NuxtLink to="/dashboard/scanner" class="text-slate-400 hover:text-white px-3 py-1.5 rounded-lg transition">Gate Scanner</NuxtLink>
            <NuxtLink to="/dashboard/settings" class="text-slate-400 hover:text-white px-3 py-1.5 rounded-lg transition">Branding & Payouts</NuxtLink>
          </nav>
        </div>

        <div class="flex items-center space-x-3">
          <NuxtLink to="/dashboard/events/create" class="btn-primary text-xs !py-2 !px-3.5 flex items-center gap-1">
            <span>+ Create Event</span>
          </NuxtLink>
          <NuxtLink to="/dashboard/scanner" class="btn-secondary text-xs !py-2 !px-3.5 flex items-center gap-1 border-indigo-500/30 text-indigo-300">
            <span>🔍 Gate Scanner</span>
          </NuxtLink>
          <button @click="logout" class="text-xs text-slate-400 hover:text-white px-3 py-2">
            Logout
          </button>
        </div>
      </div>
    </header>

    <!-- Content Area -->
    <main class="max-w-7xl mx-auto px-6 py-8 flex-grow w-full space-y-8">
      <!-- KPI Cards Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="glass-card rounded-2xl p-6 border-indigo-500/20">
          <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Total Revenue</span>
          <div class="text-3xl font-extrabold text-white">
            ₦{{ (analytics?.totalRevenue || 0).toLocaleString() }}
          </div>
          <span class="text-[11px] text-emerald-400 font-medium block mt-2">↑ 100% Verified via Paystack</span>
        </div>

        <div class="glass-card rounded-2xl p-6 border-indigo-500/20">
          <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Tickets Sold</span>
          <div class="text-3xl font-extrabold text-white">
            {{ analytics?.totalTicketsSold || 0 }}
          </div>
          <span class="text-[11px] text-indigo-400 font-medium block mt-2">Across all published events</span>
        </div>

        <div class="glass-card rounded-2xl p-6 border-indigo-500/20">
          <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Check-in Rate</span>
          <div class="text-3xl font-extrabold text-white">
            {{ analytics?.checkInRate || 0 }}%
          </div>
          <span class="text-[11px] text-purple-400 font-medium block mt-2">{{ analytics?.checkedInTickets || 0 }} Checked In</span>
        </div>

        <div class="glass-card rounded-2xl p-6 border-indigo-500/20">
          <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Active Events</span>
          <div class="text-3xl font-extrabold text-white">
            {{ events.length }}
          </div>
          <span class="text-[11px] text-slate-400 font-medium block mt-2">Published Events</span>
        </div>
      </div>

      <!-- Events List Table / Cards -->
      <div class="glass-card rounded-2xl p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-white">My Events</h2>
          <NuxtLink to="/dashboard/events/create" class="text-xs font-semibold text-indigo-400 hover:text-indigo-300">
            + Add New Event
          </NuxtLink>
        </div>

        <div v-if="events.length === 0" class="text-center py-12 text-slate-500 text-sm">
          No events created yet. Click "+ Create Event" to publish your first ticketed event.
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full text-left text-sm text-slate-300">
            <thead class="bg-slate-900/60 text-xs uppercase text-slate-400 border-b border-slate-800">
              <tr>
                <th class="py-3 px-4">Event Title</th>
                <th class="py-3 px-4">Date</th>
                <th class="py-3 px-4">Location</th>
                <th class="py-3 px-4">Tickets Sold</th>
                <th class="py-3 px-4">Status</th>
                <th class="py-3 px-4 text-right">Roster</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/60">
              <tr v-for="ev in events" :key="ev._id" class="hover:bg-slate-900/40 transition">
                <td class="py-4 px-4 font-semibold text-white">
                  {{ ev.title }}
                </td>
                <td class="py-4 px-4 text-xs text-slate-400">
                  {{ new Date(ev.startDate).toLocaleDateString() }}
                </td>
                <td class="py-4 px-4 text-xs text-slate-400">
                  {{ ev.location }}
                </td>
                <td class="py-4 px-4 font-semibold text-indigo-300">
                  {{ ev.totalSold || 0 }} / {{ ev.totalCapacity || 0 }}
                </td>
                <td class="py-4 px-4">
                  <span class="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {{ ev.status }}
                  </span>
                </td>
                <td class="py-4 px-4 text-right">
                  <NuxtLink :to="`/dashboard/events/${ev._id}/attendees`" class="btn-secondary text-xs !py-1 !px-3">
                    Attendees 📋
                  </NuxtLink>
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
const user = ref(null);
const analytics = ref(null);
const events = ref([]);

function logout() {
  localStorage.removeItem('cmt_token');
  localStorage.removeItem('cmt_user');
  useRouter().push('/login');
}

async function loadDashboardData() {
  const token = localStorage.getItem('cmt_token');
  if (!token) {
    useRouter().push('/login');
    return;
  }

  try {
    user.value = JSON.parse(localStorage.getItem('cmt_user') || '{}');

    const [analyticsRes, eventsRes] = await Promise.all([
      fetch(`${config.public.apiBase}/analytics/tenant`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch(`${config.public.apiBase}/events/admin/my-events`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);

    if (analyticsRes.ok) analytics.value = await analyticsRes.json();
    if (eventsRes.ok) events.value = await eventsRes.json();
  } catch (err) {
    console.error('Error loading organizer data:', err);
  }
}

onMounted(() => {
  loadDashboardData();
});
</script>
