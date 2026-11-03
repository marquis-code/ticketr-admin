/**
 * The dedicated console deployment only serves /admin/* routes.
 * Tokens are checked for expiry and role before a console page renders.
 */
function tokenState() {
  if (typeof localStorage === 'undefined') {
    return { token: null as string | null, role: null as string | null, expired: false };
  }
  const token = localStorage.getItem('ticketr_admin_token');
  if (!token) return { token: null, role: null, expired: false };
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    return { token, role: payload?.role || null, expired: !payload?.exp || payload.exp * 1000 < Date.now() };
  } catch {
    return { token, role: null, expired: true };
  }
}

export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server) return;

  const { token, role, expired } = tokenState();
  if (expired && token) {
    localStorage.removeItem('ticketr_admin_token');
    localStorage.removeItem('ticketr_admin_user');
  }
  const authed = !!token && !expired;

  if (to.path === '/' || to.path === '') {
    return navigateTo(authed ? '/admin/dashboard' : '/admin/login');
  }

  if (!to.path.startsWith('/admin')) {
    return navigateTo(authed ? '/admin/dashboard' : '/admin/login', { redirectCode: 302 });
  }

  const authRoutes = ['/admin/login', '/admin/signup', '/admin/forgot-password', '/admin/reset-password'];
  const isAuthRoute = authRoutes.includes(to.path);

  if (authed && isAuthRoute) {
    return navigateTo(role === 'STAFF' ? '/admin/scanner' : '/admin/dashboard', { redirectCode: 302 });
  }
  if (!authed && !isAuthRoute) {
    return navigateTo(`/admin/login?redirect=${encodeURIComponent(to.fullPath)}`, { redirectCode: 302 });
  }
  if (authed && role === 'STAFF') {
    const allowed = ['/admin/scanner', '/admin/attendees', '/admin/verify'];
    if (!allowed.some((path) => to.path.startsWith(path))) {
      return navigateTo('/admin/scanner', { redirectCode: 302 });
    }
  }
});
