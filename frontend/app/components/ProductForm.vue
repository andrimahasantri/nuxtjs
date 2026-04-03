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
      class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
      @click="showForm = true"
    >
      + Add Product
    </button>

    <div v-if="showForm" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Add New Product</h2>

      <div v-if="error" class="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
        {{ error }}
      </div>

      <form @submit.prevent="submit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Name *</label>
          <input
            v-model="form.name"
            type="text"
            required
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            placeholder="Product name"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            v-model="form.description"
            rows="3"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            placeholder="Product description (optional)"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Price *</label>
          <input
            v-model.number="form.price"
            type="number"
            step="0.01"
            min="0"
            required
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            placeholder="0.00"
          />
        </div>
        <div class="flex gap-3">
          <button
            type="submit"
            :disabled="loading"
            class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {{ loading ? 'Saving...' : 'Save Product' }}
          </button>
          <button
            type="button"
            class="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            @click="showForm = false"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
