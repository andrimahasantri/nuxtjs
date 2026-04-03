interface Product {
  id: number
  name: string
  description: string | null
  price: number
  created_at: string
  updated_at: string
}

interface ProductsResponse {
  data: Product[]
  total: number
  page: number
  limit: number
}

interface CreateProductPayload {
  name: string
  description?: string
  price: number
}

export const useProducts = () => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase

  const fetchProducts = async (params: {
    page?: number
    limit?: number
    search?: string
  } = {}): Promise<ProductsResponse> => {
    const query = new URLSearchParams()
    if (params.page) query.set('page', String(params.page))
    if (params.limit) query.set('limit', String(params.limit))
    if (params.search) query.set('search', params.search)

    const url = `${apiBase}/products${query.toString() ? '?' + query.toString() : ''}`
    return await $fetch<ProductsResponse>(url)
  }

  const createProduct = async (payload: CreateProductPayload): Promise<Product> => {
    return await $fetch<Product>(`${apiBase}/products`, {
      method: 'POST',
      body: payload,
    })
  }

  return { fetchProducts, createProduct }
}
