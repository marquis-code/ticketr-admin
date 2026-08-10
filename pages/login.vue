<template>
  <div class="min-h-screen flex items-center justify-center p-6 bg-gray-50">
    <div class="w-full max-w-md bg-white border border-gray-200 rounded-xl p-8">
      <div class="text-center mb-8">
        <!-- Ticketr Logo -->
        <div class="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mx-auto mb-4">
          <svg class="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
          </svg>
        </div>
        <h1 class="font-display text-2xl font-bold text-gray-900">Organizer Portal</h1>
        <p class="text-sm text-gray-500 mt-1">Ticketr Event Management &amp; Analytics</p>
      </div>

      <div class="flex border-b border-gray-200 mb-6">
        <button
          @click="isRegister = false"
          :class="!isRegister ? 'border-primary text-primary font-semibold' : 'border-transparent text-gray-400'"
          class="flex-1 pb-3 text-sm text-center border-b-2 transition"
        >
          Login
        </button>
        <button
          @click="isRegister = true"
          :class="isRegister ? 'border-primary text-primary font-semibold' : 'border-transparent text-gray-400'"
          class="flex-1 pb-3 text-sm text-center border-b-2 transition"
        >
          Register Organization
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div v-if="isRegister">
          <label class="block text-xs font-medium text-gray-600 mb-1.5">Organization Name</label>
          <input
            v-model="form.organizationName"
            type="text"
            placeholder="e.g. School of Nursing"
            required
            class="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
          />
        </div>

        <div v-if="isRegister">
          <label class="block text-xs font-medium text-gray-600 mb-1.5">Subdomain Slug</label>
          <div class="flex items-center">
            <input
              v-model="form.tenantSlug"
              type="text"
              placeholder="nursing"
              required
              class="w-full bg-white border border-gray-200 rounded-l-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
            />
            <span class="bg-gray-50 border border-l-0 border-gray-200 text-gray-500 text-xs px-3 py-3 rounded-r-lg whitespace-nowrap">.ticketr.org</span>
          </div>
        </div>

        <div v-if="isRegister">
          <label class="block text-xs font-medium text-gray-600 mb-1.5">Full Name</label>
          <input
            v-model="form.name"
            type="text"
            placeholder="John Organizer"
            required
            class="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
          />
        </div>

        <div>
          <label class="block text-xs font-medium text-gray-600 mb-1.5">Email Address</label>
          <input
            v-model="form.email"
            type="email"
            placeholder="admin@organization.edu"
            required
            class="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
          />
        </div>

        <div>
          <label class="block text-xs font-medium text-gray-600 mb-1.5">Password</label>
          <div class="relative">
            <input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="••••••••"
              required
              class="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition pr-10"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <Eye v-if="!showPassword" class="w-4 h-4" />
              <EyeOff v-else class="w-4 h-4" />
            </button>
          </div>
        </div>

        <div v-if="errorMsg" class="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs">
          {{ errorMsg }}
        </div>

        <button type="submit" :disabled="submitting" class="w-full btn-primary py-3 text-sm flex items-center justify-center gap-2">
          <span v-if="submitting" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          <span>{{ submitting ? 'Processing...' : (isRegister ? 'Create Account' : 'Sign In') }}</span>
        </button>
      </form>

      <p class="text-center text-xs text-gray-400 mt-6">
        Powered by <span class="font-semibold text-primary">Ticketr</span>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Eye, EyeOff } from 'lucide-vue-next';

definePageMeta({ layout: false });

const config = useRuntimeConfig();

const isRegister = ref(false);
const submitting = ref(false);
const errorMsg = ref('');
const showPassword = ref(false);

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
      localStorage.setItem('ticketr_admin_token', data.accessToken);
      localStorage.setItem('ticketr_admin_user', JSON.stringify(data.user));
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
