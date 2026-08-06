import { useQuery } from "@tanstack/react-query"

import { supplierApi } from "@/features/supplier/api/supplier-api"

export function useDashboardStats() {
  return useQuery({
    queryKey: ["supplier", "dashboard-stats"],
    queryFn: supplierApi.getDashboardStats,
  })
}
