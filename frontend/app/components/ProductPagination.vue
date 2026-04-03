<script setup lang="ts">
const props = defineProps<{
  page: number
  limit: number
  total: number
}>()

const emit = defineEmits<{
  'update:page': [page: number]
}>()

const totalPages = computed(() => Math.ceil(props.total / props.limit))

const goTo = (p: number) => {
  if (p >= 1 && p <= totalPages.value) {
    emit('update:page', p)
  }
}
</script>

<template>
  <div v-if="totalPages > 1" class="flex items-center justify-center gap-2 mt-6">
    <button
      :disabled="page <= 1"
      class="px-3 py-1 rounded border border-gray-300 text-sm disabled:opacity-40 hover:bg-gray-50 transition-colors"
      @click="goTo(page - 1)"
    >
      Previous
    </button>

    <template v-for="p in totalPages" :key="p">
      <button
        v-if="p === 1 || p === totalPages || (p >= page - 1 && p <= page + 1)"
        class="px-3 py-1 rounded text-sm transition-colors"
        :class="p === page ? 'bg-indigo-600 text-white' : 'border border-gray-300 hover:bg-gray-50'"
        @click="goTo(p)"
      >
        {{ p }}
      </button>
      <span
        v-else-if="p === page - 2 || p === page + 2"
        class="text-gray-400"
      >...</span>
    </template>

    <button
      :disabled="page >= totalPages"
      class="px-3 py-1 rounded border border-gray-300 text-sm disabled:opacity-40 hover:bg-gray-50 transition-colors"
      @click="goTo(page + 1)"
    >
      Next
    </button>
  </div>

  <p class="text-center text-sm text-gray-500 mt-2">
    Showing {{ (page - 1) * limit + 1 }}–{{ Math.min(page * limit, total) }} of {{ total }} products
  </p>
</template>
