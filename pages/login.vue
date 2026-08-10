<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
    <div class="w-full max-w-md glass-card rounded-2xl p-8 border-indigo-500/30">
      <div class="text-center mb-8">
        <div class="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center font-bold text-2xl text-white shadow-lg shadow-indigo-500/20 mx-auto mb-3">
          ⚡
        </div>
        <h1 class="text-2xl font-extrabold text-white">Organizer Portal</h1>
        <p class="text-xs text-slate-400 mt-1">CMultiTickets Event Management & Analytics</p>
      </div>

      <div class="flex border-b border-slate-800 mb-6">
        <button
          @click="isRegister = false"
          :class="!isRegister ? 'border-indigo-500 text-indigo-400 font-bold' : 'border-transparent text-slate-500'"
          class="flex-1 pb-3 text-sm text-center border-b-2 transition"
        >
          Login
        </button>
        <button
          @click="isRegister = true"
          :class="isRegister ? 'border-indigo-500 text-indigo-400 font-bold' : 'border-transparent text-slate-500'"
          class="flex-1 pb-3 text-sm text-center border-b-2 transition"
        >
          Register Organization
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div v-if="isRegister">
          <label class="block text-xs font-medium text-slate-400 mb-1">Organization Name</label>
          <input
            v-model="form.organizationName"
            type="text"
            placeholder="e.g. School of Nursing"
            required
            class="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
          />
        </div>

        <div v-if="isRegister">
          <label class="block text-xs font-medium text-slate-400 mb-1">Subdomain Slug</label>
          <div class="flex items-center">
            <input
              v-model="form.tenantSlug"
              type="text"
              placeholder="nursing"
              required
              class="w-full bg-slate-900 border border-slate-800 rounded-l-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
            />
            <span class="bg-slate-800 border border-l-0 border-slate-800 text-slate-400 text-xs px-3 py-3 rounded-r-xl">.cmultickets.com</span>
          </div>
        </div>

        <div>
          <label class="block text-xs font-medium text-slate-400 mb-1">Full Name</label>
          <input
            v-model="form.name"
            type="text"
            placeholder="John Organizer"
            :required="isRegister"
            class="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
          />
        </div>

        <div>
          <label class="block text-xs font-medium text-slate-400 mb-1">Work Email</label>
          <input
            v-model="form.email"
            type="email"
            placeholder="admin@nursing.edu"
            required
            class="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
          />
        </div>

        <div>
          <label class="block text-xs font-medium text-slate-400 mb-1">Password</label>
          <input
            v-model="form.password"
            type="password"
            placeholder="••••••••"
            required
            class="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
          />
        </div>

        <div v-if="errorMsg" class="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
          {{ errorMsg }}
        </div>

        <button type="submit" :disabled="submitting" class="w-full btn-primary py-3 text-sm flex items-center justify-center gap-2">
          <span v-if="submitting" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          <span>{{ submitting ? 'Processing...' : (isRegister ? 'Create Account' : 'Sign In') }}</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const config = useRuntimeConfig();

const isRegister = ref(false);
const submitting = ref(false);
const errorMsg = ref('');

const form = ref({
  name: '',
  email: '',
  password: '',
  organizationName: '',
  tenantSlug: '',
});

async function handleSubmit() {
  submitting.value = true;
  errorMsg.value = '';

  try {
    const endpoint = isRegister.value ? `${config.public.apiBase}/auth/register` : `${config.public.apiBase}/auth/login`;
    const payload = isRegister.value
      ? {
          name: form.value.name,
          email: form.value.email,
          password: form.value.password,
          role: 'ORGANIZER',
          organizationName: form.value.organizationName,
          tenantSlug: form.value.tenantSlug,
        }
      : {
          email: form.value.email,
          password: form.value.password,
        };

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('cmt_token', data.accessToken);
      localStorage.setItem('cmt_user', JSON.stringify(data.user));
      useRouter().push('/dashboard');
    } else {
      const err = await res.json();
      errorMsg.value = err.message || 'Authentication failed';
    }
  } catch (err) {
    errorMsg.value = 'Network connection error';
  } finally {
    submitting.value = false;
  }
}
</script>
