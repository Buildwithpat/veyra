export interface CartItem {
  productId: string
  slug: string
  name: string
  fabricType: string
  color: string
  colorHex: string
  supplierId: string
  supplierName: string
  pricePerUnit: number
  unit: string
  moq: number
  quantity: number
}
