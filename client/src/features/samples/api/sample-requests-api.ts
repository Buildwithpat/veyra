import { apiClient } from "@/lib/api-client"
import type {
  CreateSampleRequestInput,
  SampleRequest,
  SampleRequestStatus,
} from "@/features/samples/types"
import type { ApiSuccess } from "@/types/api"

export const sampleRequestsApi = {
  async create(input: CreateSampleRequestInput) {
    const { data } = await apiClient.post<ApiSuccess<SampleRequest>>(
      "/sample-requests",
      input,
    )
    return data.data
  },

  async listMine() {
    const { data } = await apiClient.get<ApiSuccess<SampleRequest[]>>("/sample-requests")
    return data.data
  },

  async listIncoming(status?: SampleRequestStatus) {
    const { data } = await apiClient.get<ApiSuccess<SampleRequest[]>>(
      "/sample-requests/incoming",
      { params: status ? { status } : undefined },
    )
    return data.data
  },

  async updateStatus(id: string, status: Exclude<SampleRequestStatus, "pending">) {
    const { data } = await apiClient.patch<ApiSuccess<SampleRequest>>(
      `/sample-requests/${id}/status`,
      { status },
    )
    return data.data
  },
}
