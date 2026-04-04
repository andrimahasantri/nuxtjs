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
    <!-- Toolbar -->
    <div class="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
      <div class="relative w-full sm:w-80">
        <svg class="absolute left-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          v-model="search"
          type="text"
          placeholder="Search products..."
          class="w-full bg-white border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
          @input="onSearch"
        />
      </div>

      <ProductForm @created="page = 1; refresh()" />
    </div>

    <!-- Stats Bar -->
    <div v-if="result && status !== 'pending'" class="flex items-center gap-3 text-sm text-slate-500">
      <span>
        <strong class="font-medium text-slate-700">{{ result.total }}</strong> product{{ result.total !== 1 ? 's' : '' }}
      </span>
      <span v-if="search" class="inline-flex items-center gap-1 text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md text-xs font-medium">
        "{{ search }}"
        <button @click="search = ''; page = 1; refresh()" class="ml-0.5 hover:text-indigo-800">
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </span>
    </div>

    <!-- Loading State -->
    <div v-if="status === 'pending'" class="flex flex-col items-center justify-center py-16">
      <div class="w-8 h-8 border-2 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
      <p class="mt-3 text-sm text-slate-500">Loading products...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="status === 'error'" class="flex flex-col items-center justify-center py-16 text-center">
      <div class="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-3">
        <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h3 class="text-base font-semibold text-slate-900">Connection Error</h3>
      <p class="text-sm text-slate-500 mt-1 max-w-sm">Failed to load products. Make sure the backend API is running on port 3001.</p>
      <button @click="refresh()" class="mt-3 text-sm font-medium text-indigo-600 hover:text-indigo-700">
        Try again
      </button>
    </div>

    <!-- Content -->
    <template v-else-if="result">
      <!-- Empty State -->
      <div v-if="result.data.length === 0" class="flex flex-col items-center justify-center py-16 text-center">
        <div class="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-3">
          <svg class="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-2.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <h3 class="text-base font-semibold text-slate-900">No products found</h3>
        <p class="text-sm text-slate-500 mt-1">
          {{ search ? 'Try adjusting your search terms.' : 'Get started by adding your first product.' }}
        </p>
      </div>

      <!-- Product Table -->
      <div v-else class="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-slate-200 bg-slate-50">
              <th class="text-left px-4 py-3 font-medium text-slate-600">Product</th>
              <th class="text-right px-4 py-3 font-medium text-slate-600 hidden sm:table-cell">Price</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <ProductCard
              v-for="product in result.data"
              :key="product.id"
              :product="product"
            />
          </tbody>
        </table>
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
