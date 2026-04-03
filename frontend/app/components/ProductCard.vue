<script setup lang="ts">
defineProps<{
  product: {
    id: number
    name: string
    description: string | null
    price: number
  }
}>()
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
    <h3 class="text-lg font-semibold text-gray-900 mb-1">{{ product.name }}</h3>
    <p class="text-sm text-gray-500 mb-3 line-clamp-2">
      {{ product.description || 'No description' }}
    </p>
    <p class="text-xl font-bold text-indigo-600">
      ${{ Number(product.price).toFixed(2) }}
    </p>
  </div>
</template>
