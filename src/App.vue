<script setup>
import { ref, onMounted } from 'vue'
import { get } from './utils/api.js'

const result = ref(null)
const error = ref(null)

onMounted(async () => {
  try {
    const response = await get('/test')
    result.value = await response.json()
  } catch (e) {
    error.value = e.message
  }
})
</script>

<template>
  <div>
    <h1>Connection Test</h1>

    <pre v-if="result">{{ result }}</pre>
    <p v-if="error">Error: {{ error }}</p>
  </div>
</template>