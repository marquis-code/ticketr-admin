<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
    <!-- Top Bar -->
    <header class="glass-card border-b border-slate-800 px-6 py-4">
      <div class="max-w-4xl mx-auto flex items-center justify-between">
        <NuxtLink to="/dashboard" class="text-sm font-semibold text-slate-400 hover:text-white transition">
          ← Dashboard
        </NuxtLink>
        <span class="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          Gate Check-in Scanner Active
        </span>
      </div>
    </header>

    <main class="max-w-xl mx-auto px-6 py-12 flex-grow w-full space-y-6">
      <div class="glass-card rounded-2xl p-8 border-indigo-500/30 text-center">
        <div class="w-16 h-16 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
          🔍
        </div>
        <h1 class="text-2xl font-extrabold text-white mb-2">Gate Entry Scanner</h1>
        <p class="text-xs text-slate-400 mb-6">Scan QR code or paste HMAC hash token from attendee's e-ticket.</p>

        <form @submit.prevent="verifyTicketScan" class="space-y-4">
          <div class="relative">
            <input
              v-model="qrInput"
              type="text"
              placeholder="Paste QR Code Hash / Scan..."
              required
              class="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition text-center font-mono"
            />
          </div>

          <button type="submit" :disabled="verifying || !qrInput" class="w-full btn-primary py-3 text-sm flex items-center justify-center gap-2">
            <span v-if="verifying" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            <span>{{ verifying ? 'Verifying...' : 'Verify Ticket' }}</span>
          </button>
        </form>
      </div>

      <!-- Result Card Feedback -->
      <div v-if="scanResult" class="glass-card rounded-2xl p-6 transition-all border-2" :class="scanResult.valid ? 'border-emerald-500/80 bg-emerald-950/20' : (scanResult.alreadyCheckedIn ? 'border-amber-500/80 bg-amber-950/20' : 'border-rose-500/80 bg-rose-950/20')">
        <div class="flex items-start gap-4">
          <div class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-bold" :class="scanResult.valid ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'">
            {{ scanResult.valid ? '✅' : (scanResult.alreadyCheckedIn ? '⚠️' : '❌') }}
          </div>

          <div class="flex-grow space-y-1">
            <h3 class="font-bold text-lg text-white">
              {{ scanResult.message }}
            </h3>
            <p v-if="scanResult.attendeeName" class="text-sm font-semibold text-indigo-300">
              Attendee: {{ scanResult.attendeeName }}
            </p>
            <p v-if="scanResult.tierName" class="text-xs text-slate-300">
              Ticket Tier: {{ scanResult.tierName }} ({{ scanResult.ticketNumber }})
            </p>
            <p v-if="scanResult.checkedInAt" class="text-[11px] text-slate-400 pt-2 border-t border-slate-800 mt-2">
              Scanned At: {{ new Date(scanResult.checkedInAt).toLocaleString() }}
            </p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const config = useRuntimeConfig();

const qrInput = ref('');
const verifying = ref(false);
const scanResult = ref(null);

async function verifyTicketScan() {
  const token = localStorage.getItem('cmt_token');
  if (!token) {
    alert('Please log in to use gate scanner.');
    useRouter().push('/login');
    return;
  }

  verifying.value = true;
  scanResult.value = null;

  try {
    const res = await fetch(`${config.public.apiBase}/tickets/verify-scan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ qrCodeHash: qrInput.value.trim() }),
    });

    if (res.ok) {
      scanResult.value = await res.json();
    } else {
      const err = await res.json();
      scanResult.value = {
        valid: false,
        message: err.message || 'Invalid QR code or ticket scan failed',
      };
    }
  } catch (err) {
    scanResult.value = {
      valid: false,
      message: 'Network error verifying ticket',
    };
  } finally {
    verifying.value = false;
  }
}
</script>
