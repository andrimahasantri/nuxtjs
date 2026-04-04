<script setup lang="ts">
defineProps<{
  product: {
    id: number
    name: string
    description: string | null
    price: number
  }
}>()

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price)
}
</script>

<template>
  <div class="group relative bg-white rounded-2xl border border-slate-200/80 p-5 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-300">
    <!-- Price Badge -->
    <div class="absolute top-4 right-4">
      <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border border-indigo-100/80">
        {{ formatPrice(Number(product.price)) }}
      </span>
    </div>

    <!-- Content -->
    <div class="pr-20 sm:pr-24">
      <div class="w-8 h-8 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
        <svg class="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      </div>

      <h3 class="text-base font-semibold text-slate-900 group-hover:text-indigo-700 transition-colors line-clamp-1">
        {{ product.name }}
      </h3>
    </div>

    <p class="mt-2 text-sm text-slate-500 line-clamp-2 leading-relaxed min-h-[2.5rem]">
      {{ product.description || 'No description available' }}
    </p>

    <!-- Bottom Accent -->
    <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
      <span class="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Product #{{ product.id }}</span>
      <div class="w-5 h-5 rounded-full bg-slate-50 group-hover:bg-indigo-50 flex items-center justify-center transition-colors">
        <svg class="w-3 h-3 text-slate-400 group-hover:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  </div>
</template>
