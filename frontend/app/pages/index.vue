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
  <div class="space-y-8">
    <!-- Page Header -->
    <div>
      <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
        Products
      </h2>
      <p class="mt-1 text-sm text-slate-500">Browse, search, and manage your product catalog.</p>
    </div>

    <!-- Toolbar -->
    <div class="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
      <div class="relative w-full sm:w-96">
        <input
          v-model="search"
          type="text"
          placeholder="Search by name or description..."
          class="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none transition-all shadow-sm"
          @input="onSearch"
        />
        <svg class="absolute left-3.5 top-3 h-4.5 w-4.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <ProductForm @created="page = 1; refresh()" />
    </div>

    <!-- Stats Bar -->
    <div v-if="result && status !== 'pending'" class="flex items-center gap-4 text-sm">
      <span class="inline-flex items-center gap-1.5 text-slate-500">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
        <strong class="font-semibold text-slate-700">{{ result.total }}</strong> product{{ result.total !== 1 ? 's' : '' }}
      </span>
      <span v-if="search" class="inline-flex items-center gap-1 text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full text-xs font-medium">
        Filtered: "{{ search }}"
        <button @click="search = ''; page = 1; refresh()" class="ml-0.5 hover:text-indigo-800">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </span>
    </div>

    <!-- Loading State -->
    <div v-if="status === 'pending'" class="flex flex-col items-center justify-center py-20">
      <div class="w-10 h-10 border-[3px] border-slate-200 border-t-indigo-500 rounded-full animate-spin"></div>
      <p class="mt-4 text-sm text-slate-500 font-medium">Loading products...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="status === 'error'" class="flex flex-col items-center justify-center py-20 text-center">
      <div class="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mb-4">
        <svg class="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h3 class="text-lg font-semibold text-slate-900">Connection Error</h3>
      <p class="text-sm text-slate-500 mt-1 max-w-sm">Failed to load products. Make sure the backend API is running on port 3001.</p>
      <button @click="refresh()" class="mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-700 underline underline-offset-2">
        Try again
      </button>
    </div>

    <!-- Content -->
    <template v-else-if="result">
      <!-- Empty State -->
      <div v-if="result.data.length === 0" class="flex flex-col items-center justify-center py-20 text-center">
        <div class="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
          <svg class="w-7 h-7 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-2.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-slate-900">No products found</h3>
        <p class="text-sm text-slate-500 mt-1">
          {{ search ? 'Try adjusting your search terms.' : 'Get started by adding your first product.' }}
        </p>
      </div>

      <!-- Product Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
