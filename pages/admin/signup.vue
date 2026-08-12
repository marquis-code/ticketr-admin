<template>
  <div class="min-h-screen flex w-full bg-white font-sans">
    <!-- Left: Form Container -->
    <div class="w-full lg:w-[55%] xl:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 xl:px-32 relative bg-white z-10 shadow-2xl lg:shadow-none">
      
      <!-- Subtle top decorative element -->
      <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-purple-500 to-pink-500"></div>

      <transition name="fade-slide" appear>
        <div class="w-full max-w-md mx-auto py-8">
          <!-- Logo & Header -->
          <div class="mb-10 text-center lg:text-left">
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary-700 flex items-center justify-center mb-6 shadow-xl shadow-primary/30 mx-auto lg:mx-0 transform hover:scale-105 transition-transform">
              <Ticket class="w-6 h-6 text-white" />
            </div>
            <h1 class="font-display text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Register Organization</h1>
            <p class="text-sm text-gray-500 mt-2 font-medium">Create your account to start managing events.</p>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-5">
            <div class="space-y-4">
              <div class="relative group">
                <label class="block text-sm font-bold text-gray-700 mb-1.5">Organization Name</label>
                <input
                  v-model="form.organizationName"
                  type="text"
                  placeholder="e.g. Campus Events Board"
                  required
                  class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all shadow-sm"
                />
              </div>

              <div class="relative group">
                <label class="block text-sm font-bold text-gray-700 mb-1.5">Subdomain Slug</label>
                <div class="flex items-center shadow-sm rounded-xl">
                  <input
                    v-model="form.tenantSlug"
                    type="text"
                    placeholder="events"
                    required
                    class="w-full bg-gray-50 border border-gray-200 border-r-0 rounded-l-xl px-4 py-3.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all relative z-10"
                  />
                  <span class="bg-gray-100 border border-gray-200 border-l-0 text-gray-500 text-sm px-4 py-3.5 rounded-r-xl whitespace-nowrap font-medium select-none z-0">
                    .ticketr.org
                  </span>
                </div>
              </div>

              <div class="relative group">
                <label class="block text-sm font-bold text-gray-700 mb-1.5">Full Name</label>
                <input
                  v-model="form.name"
                  type="text"
                  placeholder="John Organizer"
                  required
                  class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all shadow-sm"
                />
              </div>

              <div class="relative group">
                <label class="block text-sm font-bold text-gray-700 mb-1.5">Email Address</label>
                <input
                  v-model="form.email"
                  type="email"
                  placeholder="admin@organization.edu"
                  required
                  class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all shadow-sm"
                />
              </div>

              <div class="relative group">
                <label class="block text-sm font-bold text-gray-700 mb-1.5">Password</label>
                <div class="relative shadow-sm rounded-xl">
                  <input
                    v-model="form.password"
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="••••••••"
                    required
                    class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all pr-12"
                  />
                  <button
                    type="button"
                    @click="showPassword = !showPassword"
                    class="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-primary focus:outline-none transition-colors"
                  >
                    <Eye v-if="!showPassword" class="w-5 h-5" />
                    <EyeOff v-else class="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            <transition name="fade">
              <div v-if="errorMsg" class="p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3">
                <div class="bg-red-100 p-1 rounded-full text-red-500 mt-0.5">
                  <AlertCircle class="w-4 h-4" />
                </div>
                <p class="text-red-700 text-sm font-medium">{{ errorMsg }}</p>
              </div>
            </transition>

            <button 
              type="submit" 
              :disabled="submitting" 
              class="w-full btn-primary py-4 text-sm font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/30 hover:shadow-primary/40 transform hover:-translate-y-0.5 transition-all mt-4"
            >
              <AppLoader v-if="submitting" size="sm" color="white" />
              <span v-else>Create Organization Account</span>
              <ArrowRight v-if="!submitting" class="w-5 h-5" />
            </button>
          </form>

          <p class="text-center text-sm text-gray-500 mt-8 font-medium">
            Already have an account? 
            <NuxtLink to="/login" class="font-bold text-primary hover:underline transition-all">Sign In</NuxtLink>
          </p>
        </div>
      </transition>
    </div>

    <!-- Right: Exciting Image Background -->
    <div class="hidden lg:block lg:w-[45%] xl:w-1/2 relative overflow-hidden bg-gray-900">
      <!-- Animated Background Image (Ken Burns Effect) -->
      <div class="absolute inset-0 w-full h-full">
        <img 
          src="/student_event_auth.png" 
          alt="Exciting Event Background" 
          class="w-full h-full object-cover animate-ken-burns opacity-90"
        />
      </div>
      
      <!-- Gradients for depth and readability -->
      <div class="absolute inset-0 bg-gradient-to-br from-primary/60 via-purple-900/70 to-gray-900/90 mix-blend-multiply"></div>
      <div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
      <div class="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] opacity-30"></div>

      <!-- Content Overlay -->
      <div class="absolute inset-0 flex flex-col justify-end p-16 xl:p-24 pb-24 text-white z-20">
        <transition name="fade-up" appear>
          <div class="max-w-xl">
            <!-- Live Indicator Badge -->
            <div class="inline-flex items-center gap-2.5 bg-white/10 backdrop-blur-md px-5 py-2 rounded-full mb-8 border border-white/20 shadow-xl">
              <span class="relative flex h-3 w-3">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span class="text-xs font-bold tracking-widest uppercase text-white/90">Live Operations</span>
            </div>
            
            <h2 class="font-display text-4xl xl:text-5xl font-bold leading-[1.1] mb-6 text-white drop-shadow-2xl">
              Create experiences <br/>
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">that matter.</span>
            </h2>
            
            <p class="text-base xl:text-lg text-white/80 leading-relaxed font-light mb-10 border-l-2 border-primary/50 pl-6">
              Join thousands of organizers powering their events with Ticketr. Seamless ticketing, powerful analytics, and instant payouts, all in one place.
            </p>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Eye, EyeOff, Ticket, AlertCircle, ArrowRight } from 'lucide-vue-next';

definePageMeta({ layout: false });

const config = useRuntimeConfig();

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
    const endpoint = `${config.public.apiBase}/auth/register`;
    const payload = {
      name: form.value.name,
      email: form.value.email,
      password: form.value.password,
      role: 'ORGANIZER',
      organizationName: form.value.organizationName,
      tenantSlug: form.value.tenantSlug,
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
      errorMsg.value = err.message || 'Registration failed';
    }
  } catch (err) {
    errorMsg.value = 'Network connection error';
  } finally {
    submitting.value = false;
  }
}
</script>

<style scoped>
/* Animations */
.fade-slide-enter-active {
  transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-up-enter-active {
  transition: all 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.3s;
}
.fade-up-enter-from {
  opacity: 0;
  transform: translateY(40px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Ken Burns effect for background image */
@keyframes ken-burns {
  0% { transform: scale(1); }
  100% { transform: scale(1.1); }
}
.animate-ken-burns {
  animation: ken-burns 30s alternate ease-in-out infinite;
}
</style>
