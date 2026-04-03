<script setup lang="ts">
const { fetchProducts } = useProducts()

const search = ref('')
const page = ref(1)
const limit = 10

const { data: result, refresh, status } = useAsyncData(
  'products',
  () => fetchProducts({ page: page.value, limit, search: search.value || undefined }),
  { watch: [page] },
)

const searchTimeout = ref<ReturnType<typeof setTimeout>>()
const onSearch = () => {
  clearTimeout(searchTimeout.value)
  searchTimeout.value = setTimeout(() => {
    page.value = 1
    refresh()
  }, 300)
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div class="relative w-full sm:w-80">
        <input
          v-model="search"
          type="text"
          placeholder="Search products..."
          class="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          @input="onSearch"
        />
        <svg class="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <ProductForm @created="page = 1; refresh()" />
    </div>

    <div v-if="status === 'pending'" class="text-center py-12 text-gray-500">
      Loading products...
    </div>

    <div v-else-if="status === 'error'" class="text-center py-12 text-red-500">
      Failed to load products. Make sure the backend is running on port 3001.
    </div>

    <template v-else-if="result">
      <div v-if="result.data.length === 0" class="text-center py-12 text-gray-500">
        No products found.
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <ProductCard
          v-for="product in result.data"
          :key="product.id"
          :product="product"
        />
      </div>

      <ProductPagination
        :page="result.page"
        :limit="result.limit"
        :total="result.total"
        @update:page="(p) => { page = p }"
      />
    </template>
  </div>
</template>
