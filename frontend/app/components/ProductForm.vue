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
      class="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-5 py-2.5 rounded-xl hover:from-indigo-700 hover:to-indigo-800 active:scale-[0.98] transition-all shadow-md shadow-indigo-500/20 text-sm font-semibold"
      @click="showForm = true"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
      </svg>
      Add Product
    </button>

    <!-- Overlay -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-200"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-150"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="showForm" class="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm" @click.self="showForm = false">
          <Transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to-class="opacity-100 translate-y-0 sm:scale-100"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="opacity-100 translate-y-0 sm:scale-100"
            leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div v-if="showForm" class="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200/60 overflow-hidden mt-16 sm:mt-0">
              <!-- Header -->
              <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 class="text-lg font-bold text-slate-900">New Product</h2>
                  <p class="text-xs text-slate-400 mt-0.5">Add a product to your catalog</p>
                </div>
                <button @click="showForm = false" class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <!-- Body -->
              <div class="p-6">
                <div v-if="error" class="flex items-start gap-3 bg-red-50 text-red-700 p-3.5 rounded-xl mb-5 text-sm border border-red-100">
                  <svg class="w-5 h-5 text-red-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {{ error }}
                </div>

                <form @submit.prevent="submit" class="space-y-5">
                  <div>
                    <label class="block text-sm font-semibold text-slate-700 mb-1.5">
                      Product Name <span class="text-red-400">*</span>
                    </label>
                    <input
                      v-model="form.name"
                      type="text"
                      required
                      class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none transition-all"
                      placeholder="e.g. Wireless Headphones"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
                    <textarea
                      v-model="form.description"
                      rows="3"
                      class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none transition-all resize-none"
                      placeholder="Brief description of the product (optional)"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-semibold text-slate-700 mb-1.5">
                      Price (USD) <span class="text-red-400">*</span>
                    </label>
                    <div class="relative">
                      <span class="absolute left-4 top-2.5 text-sm text-slate-400 font-medium">$</span>
                      <input
                        v-model.number="form.price"
                        type="number"
                        step="0.01"
                        min="0"
                        required
                        class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none transition-all"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <!-- Actions -->
                  <div class="flex items-center gap-3 pt-2">
                    <button
                      type="submit"
                      :disabled="loading"
                      class="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-5 py-2.5 rounded-xl hover:from-indigo-700 hover:to-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-all shadow-md shadow-indigo-500/20 text-sm font-semibold"
                    >
                      <svg v-if="loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                      </svg>
                      {{ loading ? 'Saving...' : 'Save Product' }}
                    </button>
                    <button
                      type="button"
                      class="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 active:scale-[0.98] transition-all"
                      @click="showForm = false"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
