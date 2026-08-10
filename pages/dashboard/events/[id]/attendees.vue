<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
    <!-- Header -->
    <header class="glass-card border-b border-slate-800 px-6 py-4">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <NuxtLink to="/dashboard/events" class="text-xs font-semibold text-slate-400 hover:text-white transition">
          ← Back to Events
        </NuxtLink>
        <span class="text-xs font-bold text-indigo-400">Attendee Gate Roster</span>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-6 py-8 flex-grow w-full space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-extrabold text-white">{{ eventInfo?.title || 'Event Roster' }}</h1>
          <p class="text-xs text-slate-400 mt-1">Real-time attendee list and gate check-in status.</p>
        </div>

        <div class="flex items-center gap-3">
          <button @click="exportCSV" class="btn-primary text-xs !py-2 !px-4">
            📥 Export CSV
          </button>
        </div>
      </div>

      <!-- Filters & Search -->
      <div class="glass-card rounded-2xl p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by attendee name or email..."
          class="w-full sm:w-80 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
        />

        <div class="flex items-center gap-2 text-xs">
          <span class="text-slate-400">Filter Status:</span>
          <button @click="filterStatus = 'ALL'" :class="filterStatus === 'ALL' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400'" class="px-3 py-1 rounded-lg border border-slate-800">All</button>
          <button @click="filterStatus = 'CHECKED_IN'" :class="filterStatus === 'CHECKED_IN' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400'" class="px-3 py-1 rounded-lg border border-slate-800">Checked In</button>
          <button @click="filterStatus = 'ISSUED'" :class="filterStatus === 'ISSUED' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400'" class="px-3 py-1 rounded-lg border border-slate-800">Not Checked In</button>
        </div>
      </div>

      <!-- Table -->
      <div class="glass-card rounded-2xl p-6">
        <div v-if="loading" class="text-center py-12 text-slate-500 text-sm">
          Loading attendees...
        </div>

        <div v-else-if="filteredAttendees.length === 0" class="text-center py-12 text-slate-500 text-sm">
          No attendees found matching filter criteria.
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full text-left text-sm text-slate-300">
            <thead class="bg-slate-900/60 text-xs uppercase text-slate-400 border-b border-slate-800">
              <tr>
                <th class="py-3 px-4">Ticket #</th>
                <th class="py-3 px-4">Attendee Name</th>
                <th class="py-3 px-4">Email</th>
                <th class="py-3 px-4">Tier</th>
                <th class="py-3 px-4">Check-in Status</th>
                <th class="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/60">
              <tr v-for="att in filteredAttendees" :key="att._id" class="hover:bg-slate-900/40 transition">
                <td class="py-4 px-4 font-mono text-xs text-indigo-300">{{ att.ticketNumber }}</td>
                <td class="py-4 px-4 font-semibold text-white">{{ att.attendeeName }}</td>
                <td class="py-4 px-4 text-xs text-slate-400">{{ att.attendeeEmail }}</td>
                <td class="py-4 px-4 text-xs text-slate-300">{{ att.tierId?.name || 'Standard' }}</td>
                <td class="py-4 px-4">
                  <span
                    :class="att.status === 'CHECKED_IN' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'"
                    class="px-2.5 py-1 rounded-full text-[11px] font-semibold border"
                  >
                    {{ att.status }}
                  </span>
                </td>
                <td class="py-4 px-4 text-right">
                  <button
                    @click="manualCheckIn(att)"
                    :disabled="att.status === 'CHECKED_IN'"
                    class="btn-secondary text-[11px] !py-1 !px-3 disabled:opacity-40"
                  >
                    {{ att.status === 'CHECKED_IN' ? 'Checked In' : 'Manual Check-in' }}
                  </button>
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
import { ref, computed, onMounted } from 'vue';

const config = useRuntimeConfig();
const route = useRoute();

const eventId = ref(route.params.id);
const eventInfo = ref(null);
const attendees = ref([]);
const loading = ref(true);

const searchQuery = ref('');
const filterStatus = ref('ALL');

const filteredAttendees = computed(() => {
  return attendees.value.filter((a) => {
    const matchesSearch =
      a.attendeeName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      a.attendeeEmail.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      a.ticketNumber.toLowerCase().includes(searchQuery.value.toLowerCase());

    const matchesStatus = filterStatus.value === 'ALL' || a.status === filterStatus.value;
    return matchesSearch && matchesStatus;
  });
});

async function loadAttendees() {
  const token = localStorage.getItem('cmt_token');
  if (!token) return;

  loading.value = true;
  try {
    const res = await fetch(`${config.public.apiBase}/events/${eventId.value}/attendees`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      eventInfo.value = data.event;
      attendees.value = data.attendees || [];
    }
  } catch (err) {
    console.error('Error fetching attendees:', err);
  } finally {
    loading.value = false;
  }
}

async function manualCheckIn(ticket) {
  const token = localStorage.getItem('cmt_token');
  try {
    const res = await fetch(`${config.public.apiBase}/tickets/verify-scan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ qrCodeHash: ticket.qrCodeHash }),
    });
    if (res.ok) {
      ticket.status = 'CHECKED_IN';
    }
  } catch (e) {
    console.error(e);
  }
}

function exportCSV() {
  if (attendees.value.length === 0) return;
  const headers = ['Ticket Number', 'Attendee Name', 'Attendee Email', 'Tier', 'Status'];
  const rows = attendees.value.map(a => [
    a.ticketNumber,
    `"${a.attendeeName}"`,
    a.attendeeEmail,
    `"${a.tierId?.name || 'Standard'}"`,
    a.status
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `attendees-${eventId.value}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

onMounted(() => {
  loadAttendees();
});
</script>
