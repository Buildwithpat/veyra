import { apiClient } from "@/lib/api-client"
import type { Order } from "@/features/orders/types"
import type {
  AcceptRfqResponseInput,
  CreateRfqInput,
  OpenRfqForSupplier,
  RfqRequest,
  RfqRequestWithResponses,
  RfqResponse,
  SubmitRfqResponseInput,
} from "@/features/rfq/types"
import type { ApiSuccess } from "@/types/api"

export const rfqApi = {
  async create(input: CreateRfqInput) {
    const { data } = await apiClient.post<ApiSuccess<RfqRequest>>("/rfq", input)
    return data.data
  },

  async listMine() {
    const { data } = await apiClient.get<ApiSuccess<RfqRequest[]>>("/rfq/mine")
    return data.data
  },

  async getMine(id: string) {
    const { data } = await apiClient.get<ApiSuccess<RfqRequestWithResponses>>(
      `/rfq/mine/${id}`,
    )
    return data.data
  },

  async listOpen() {
    const { data } = await apiClient.get<ApiSuccess<OpenRfqForSupplier[]>>("/rfq/open")
    return data.data
  },

  async submitResponse(rfqId: string, input: SubmitRfqResponseInput) {
    const { data } = await apiClient.post<ApiSuccess<RfqResponse>>(
      `/rfq/${rfqId}/responses`,
      input,
    )
    return data.data
  },

  async acceptResponse(
    rfqId: string,
    responseId: string,
    shipping: AcceptRfqResponseInput,
  ) {
    const { data } = await apiClient.post<ApiSuccess<Order>>(
      `/rfq/${rfqId}/responses/${responseId}/accept`,
      { shipping },
    )
    return data.data
  },

  async withdrawResponse(rfqId: string, responseId: string) {
    const { data } = await apiClient.patch<ApiSuccess<RfqResponse>>(
      `/rfq/${rfqId}/responses/${responseId}/withdraw`,
    )
    return data.data
  },
}
