<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
    <!-- Top Header Navigation -->
    <header class="glass-card border-b border-slate-800/80 px-6 py-4 sticky top-0 z-40">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <div class="flex items-center space-x-6">
          <NuxtLink to="/dashboard" class="flex items-center space-x-3">
            <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center font-bold text-lg text-white shadow-lg shadow-indigo-500/20">
              ⚡
            </div>
            <span class="font-bold text-lg text-white">CMultiTickets Admin</span>
          </NuxtLink>

          <!-- Nav Tabs -->
          <nav class="hidden md:flex items-center space-x-4 text-xs font-semibold">
            <NuxtLink to="/dashboard" class="text-slate-400 hover:text-white px-3 py-1.5 rounded-lg transition">Dashboard</NuxtLink>
            <NuxtLink to="/dashboard/events" class="bg-indigo-600 text-white px-3 py-1.5 rounded-lg transition">Events Management</NuxtLink>
            <NuxtLink to="/dashboard/orders" class="text-slate-400 hover:text-white px-3 py-1.5 rounded-lg transition">Orders & Financials</NuxtLink>
            <NuxtLink to="/dashboard/scanner" class="text-slate-400 hover:text-white px-3 py-1.5 rounded-lg transition">Gate Scanner</NuxtLink>
            <NuxtLink to="/dashboard/settings" class="text-slate-400 hover:text-white px-3 py-1.5 rounded-lg transition">Branding & Payouts</NuxtLink>
          </nav>
        </div>

        <NuxtLink to="/dashboard/events/create" class="btn-primary text-xs !py-2 !px-3.5">
          + Create Event
        </NuxtLink>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-6 py-8 flex-grow w-full space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-extrabold text-white">Events Management</h1>
          <p class="text-xs text-slate-400 mt-1">Manage published events, view attendee rosters, or update event statuses.</p>
        </div>

        <div class="flex items-center gap-3">
          <input
            v-model="search"
            type="text"
            placeholder="Filter events..."
            class="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      <!-- Events Grid/List -->
      <div v-if="loading" class="text-center py-16 text-slate-500 text-sm">
        Loading events...
      </div>

      <div v-else-if="filteredEvents.length === 0" class="glass-card rounded-2xl p-12 text-center max-w-md mx-auto">
        <p class="text-white font-bold text-base mb-2">No Events Found</p>
        <p class="text-slate-400 text-xs mb-6">Create an event to start selling tickets.</p>
        <NuxtLink to="/dashboard/events/create" class="btn-primary text-xs">Create Event</NuxtLink>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="ev in filteredEvents" :key="ev._id" class="glass-card rounded-2xl overflow-hidden flex flex-col border-slate-800">
          <div class="relative h-40 bg-slate-900">
            <img
              :src="ev.bannerUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80'"
              :alt="ev.title"
              class="w-full h-full object-cover"
            />
            <div class="absolute top-3 right-3">
              <span class="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-md">
                {{ ev.status }}
              </span>
            </div>
          </div>

          <div class="p-6 flex flex-col flex-grow">
            <span class="text-xs text-indigo-400 font-semibold mb-1">📅 {{ new Date(ev.startDate).toLocaleDateString() }}</span>
            <h3 class="text-lg font-bold text-white mb-2 line-clamp-1">{{ ev.title }}</h3>
            <p class="text-xs text-slate-400 line-clamp-2 mb-4">{{ ev.description }}</p>

            <div class="bg-slate-900/60 rounded-xl p-3 border border-slate-800 flex items-center justify-between mb-4 mt-auto">
              <span class="text-xs text-slate-400">Tickets Sold:</span>
              <span class="font-bold text-white text-sm">{{ ev.totalSold || 0 }} / {{ ev.totalCapacity || 0 }}</span>
            </div>

            <div class="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80">
              <NuxtLink :to="`/dashboard/events/${ev._id}/attendees`" class="btn-secondary text-[11px] !py-2 text-center block">
                📋 Attendee Roster
              </NuxtLink>
              <button @click="deleteEvent(ev._id)" class="text-[11px] text-rose-400 hover:bg-rose-500/10 border border-rose-500/30 font-semibold py-2 rounded-xl transition">
                🗑 Delete Event
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const config = useRuntimeConfig();

const events = ref([]);
const loading = ref(true);
const search = ref('');

const filteredEvents = computed(() => {
  if (!search.value) return events.value;
  return events.value.filter(e => e.title.toLowerCase().includes(search.value.toLowerCase()));
});

async function loadEvents() {
  const token = localStorage.getItem('cmt_token');
  if (!token) {
    useRouter().push('/login');
    return;
  }

  loading.value = true;
  try {
    const res = await fetch(`${config.public.apiBase}/events/admin/my-events`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      events.value = await res.json();
    }
  } catch (err) {
    console.error('Error loading events:', err);
  } finally {
    loading.value = false;
  }
}

async function deleteEvent(eventId) {
  if (!confirm('Are you sure you want to delete this event and its ticket tiers?')) return;
  const token = localStorage.getItem('cmt_token');
  try {
    const res = await fetch(`${config.public.apiBase}/events/${eventId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      await loadEvents();
    }
  } catch (e) {
    console.error(e);
  }
}

onMounted(() => {
  loadEvents();
});
</script>
