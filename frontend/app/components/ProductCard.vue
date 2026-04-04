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
  <tr class="hover:bg-slate-50 transition-colors">
    <td class="px-4 py-3">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center shrink-0">
          <svg class="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <div class="min-w-0">
          <p class="font-medium text-slate-900 truncate">{{ product.name }}</p>
          <p class="text-xs text-slate-500 truncate mt-0.5">
            {{ product.description || 'No description' }}
          </p>
          <!-- Price shown inline on mobile -->
          <p class="text-xs font-medium text-indigo-600 mt-1 sm:hidden">
            {{ formatPrice(Number(product.price)) }}
          </p>
        </div>
      </div>
    </td>
    <td class="px-4 py-3 text-right hidden sm:table-cell">
      <span class="font-medium text-slate-900">{{ formatPrice(Number(product.price)) }}</span>
    </td>
  </tr>
</template>
