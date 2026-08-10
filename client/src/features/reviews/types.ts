export interface Review {
  id: string
  productId: string
  buyerName: string
  rating: number
  comment: string
  createdAt: string
}

export interface ReviewEligibility {
  canReview: boolean
  hasReviewed: boolean
}

export interface ReviewSummary {
  verdict: string | null
  reviewCount: number
  averageRating: number
}

export interface SubmitReviewInput {
  rating: number
  comment: string
}
