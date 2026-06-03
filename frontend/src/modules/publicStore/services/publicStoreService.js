import apiClient from '../../../core/api/apiClient'

const publicStoreService = {
  getCategories: async () => {
    const response = await apiClient.get('/public/categories/')
    return response.data
  },

  getProducts: async (filters = {}) => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.append(key, value)
      }
    })

    const query = params.toString()
    const response = await apiClient.get(`/public/products/${query ? `?${query}` : ''}`)
    return response.data
  },

  getProductBySlug: async (slug) => {
    const response = await apiClient.get(`/public/products/${slug}/`)
    return response.data
  },

  getProductDetail: async (slug) => {
    const response = await apiClient.get(`/public/products/${slug}/`)
    return response.data
  },

  getFeaturedProducts: async () => {
    const response = await apiClient.get('/public/featured/')
    return response.data
  },

  getRecommendations: async ({ occasion, budget, recipient_type, preference }) => {
    const response = await apiClient.post('/public/recommendations/', {
      occasion,
      budget,
      recipient_type,
      preference,
    })
    return response.data
  },

  getPaymentMethods: async () => {
    const response = await apiClient.get('/public/payment-methods/')
    return response.data
  },

  createOrder: async (orderData) => {
    const response = await apiClient.post('/public/orders/', orderData)
    return response.data
  },

  trackOrder: async (shortId) => {
    const response = await apiClient.get(`/public/orders/track/${shortId}/`)
    return response.data
  },
}

export default publicStoreService
