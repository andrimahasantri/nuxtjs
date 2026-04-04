<script setup lang="ts">
const emit = defineEmits<{
  created: []
}>()

const { createProduct } = useProducts()

const form = reactive({
  name: '',
  description: '',
  price: 0,
})

const loading = ref(false)
const error = ref('')
const showForm = ref(false)

const submit = async () => {
  error.value = ''
  loading.value = true
  try {
    await createProduct({
      name: form.name,
      description: form.description || undefined,
      price: Number(form.price),
    })
    form.name = ''
    form.description = ''
    form.price = 0
    showForm.value = false
    emit('created')
  } catch (e: any) {
    error.value = e?.data?.message?.join?.(', ') || e?.data?.message || 'Failed to create product'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <button
      v-if="!showForm"
      class="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 active:bg-indigo-800 transition-colors text-sm font-medium"
      @click="showForm = true"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
      Add Product
    </button>

    <!-- Overlay -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-150"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-100"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="showForm" class="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 bg-black/40" @click.self="showForm = false">
          <div class="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden mt-16 sm:mt-0">
            <!-- Header -->
            <div class="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <h2 class="text-base font-semibold text-slate-900">New Product</h2>
              <button @click="showForm = false" class="w-7 h-7 flex items-center justify-center rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Body -->
            <div class="p-5">
              <div v-if="error" class="flex items-start gap-2 bg-red-50 text-red-700 p-3 rounded-lg mb-4 text-sm border border-red-200">
                <svg class="w-4 h-4 text-red-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ error }}
              </div>

              <form @submit.prevent="submit" class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1">
                    Product Name <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="form.name"
                    type="text"
                    required
                    class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                    placeholder="e.g. Wireless Headphones"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1">Description</label>
                  <textarea
                    v-model="form.description"
                    rows="3"
                    class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors resize-none"
                    placeholder="Brief description (optional)"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1">
                    Price (USD) <span class="text-red-500">*</span>
                  </label>
                  <div class="relative">
                    <span class="absolute left-3 top-2 text-sm text-slate-400">$</span>
                    <input
                      v-model.number="form.price"
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      class="w-full border border-slate-300 rounded-lg pl-7 pr-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <!-- Actions -->
                <div class="flex items-center gap-3 pt-1">
                  <button
                    type="submit"
                    :disabled="loading"
                    class="flex-1 inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                  >
                    <svg v-if="loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    {{ loading ? 'Saving...' : 'Save Product' }}
                  </button>
                  <button
                    type="button"
                    class="px-4 py-2 rounded-lg border border-slate-300 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                    @click="showForm = false"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
