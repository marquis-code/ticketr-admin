import { GATEWAY_ENDPOINT_WITH_AUTH } from '../axios.config';

export const ordersApi = {
  getTenantOrders(params?: { page?: number; limit?: number; status?: string; departmentCode?: string }) {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/orders/tenant', { params });
  },
};
