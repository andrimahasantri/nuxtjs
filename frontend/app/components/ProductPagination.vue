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
  <div v-if="total > 0" class="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
    <p class="text-slate-500">
      Showing {{ (page - 1) * limit + 1 }}&ndash;{{ Math.min(page * limit, total) }} of {{ total }}
    </p>

    <!-- Pagination Controls -->
    <div v-if="totalPages > 1" class="flex items-center gap-1">
      <button
        :disabled="page <= 1"
        class="px-2.5 py-1.5 rounded-md text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        @click="goTo(page - 1)"
      >
        Previous
      </button>

      <template v-for="p in totalPages" :key="p">
        <button
          v-if="p === 1 || p === totalPages || (p >= page - 1 && p <= page + 1)"
          class="w-8 h-8 rounded-md text-sm font-medium transition-colors"
          :class="p === page
            ? 'bg-indigo-600 text-white'
            : 'text-slate-600 hover:bg-slate-100'"
          @click="goTo(p)"
        >
          {{ p }}
        </button>
        <span
          v-else-if="p === page - 2 || p === page + 2"
          class="w-8 h-8 flex items-center justify-center text-slate-400 text-sm"
        >...</span>
      </template>

      <button
        :disabled="page >= totalPages"
        class="px-2.5 py-1.5 rounded-md text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        @click="goTo(page + 1)"
      >
        Next
      </button>
    </div>
  </div>
</template>
