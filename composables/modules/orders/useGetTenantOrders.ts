import { ref } from 'vue';
import { ordersApi } from '@/api_factory/modules/orders';

export const useGetTenantOrders = () => {
  const orders = ref([]);
  const metadata = ref({
    total: 0,
    page: 1,
    limit: 20,
    lastPage: 1,
    statistics: {
      totalOrders: 0,
      totalPaidOrders: 0,
      totalRevenue: 0,
      totalPending: 0,
      availableDepartments: ['ALL']
    }
  });
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchOrders = async (params?: { page?: number; limit?: number; status?: string; departmentCode?: string }) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await ordersApi.getTenantOrders(params);
      orders.value = response.data?.data || response.data || [];
      if (response.data?.metadata) {
        metadata.value = response.data.metadata;
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message;
    } finally {
      loading.value = false;
    }
  };

  return { orders, metadata, loading, error, fetchOrders };
};
