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
  <div v-if="total > 0" class="mt-8 space-y-3">
    <!-- Pagination Controls -->
    <div v-if="totalPages > 1" class="flex items-center justify-center gap-1.5">
      <button
        :disabled="page <= 1"
        class="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        @click="goTo(page - 1)"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        <span class="hidden sm:inline">Previous</span>
      </button>

      <div class="flex items-center gap-1">
        <template v-for="p in totalPages" :key="p">
          <button
            v-if="p === 1 || p === totalPages || (p >= page - 1 && p <= page + 1)"
            class="w-9 h-9 rounded-lg text-sm font-medium transition-all"
            :class="p === page
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
              : 'text-slate-600 hover:bg-slate-100'"
            @click="goTo(p)"
          >
            {{ p }}
          </button>
          <span
            v-else-if="p === page - 2 || p === page + 2"
            class="w-9 h-9 flex items-center justify-center text-slate-300 text-sm"
          >...</span>
        </template>
      </div>

      <button
        :disabled="page >= totalPages"
        class="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        @click="goTo(page + 1)"
      >
        <span class="hidden sm:inline">Next</span>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>

    <!-- Info -->
    <p class="text-center text-xs text-slate-400">
      Showing {{ (page - 1) * limit + 1 }}&ndash;{{ Math.min(page * limit, total) }} of {{ total }} products
    </p>
  </div>
</template>
