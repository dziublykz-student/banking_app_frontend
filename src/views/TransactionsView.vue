<template>
  <div class="bank-page">
    <button class="back-btn" @click="router.push('/dashboard')">← Back</button>
    <header class="top-bar">
      <div>
        <p class="label">Transactions</p>
        <h1>Recent transactions</h1>
      </div>
    </header>

    <section class="transactions">
      <p v-if="error" class="error-message">{{ error }}</p>

      <div v-if="transactions.length === 0 && !error">
        No transactions found.
      </div>

      <div v-for="transaction in transactions" :key="transaction.id" class="transaction-row">
        <div>
          <p>{{ transaction.description || 'Transfer' }}</p>
          <small>
            {{ transaction.fromIban }} → {{ transaction.toIban }}
            • {{ formatDate(transaction.timestamp) }}
            • {{ transaction.type }}
          </small>
        </div>

        <strong>{{ formatMoney(transaction.amount) }}</strong>
      </div>

      <div class="pagination-controls" v-if="totalPages > 1">
        <button type="button" :disabled="isFirst" @click="previousPage">
          Previous
        </button>

        <span>Page {{ page + 1 }} of {{ totalPages }}</span>

        <button type="button" :disabled="isLast" @click="nextPage">
          Next
        </button>
      </div>
  </section>

    <nav class="bottom-nav">
      <button @click="router.push('/dashboard')">Home</button>
      <button @click="router.push('/profile')">Profile</button>
      <button @click="router.push('/help')">Help</button>
    </nav>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const transactions = ref([])
const error = ref('')

const page = ref(0)
const size = ref(5)
const totalPages = ref(0)
const isFirst = ref(true)
const isLast = ref(true)

async function fetchTransactions() {
  error.value = ''

  try {
    const response = await fetch(
      `http://localhost:8080/transactions/my-transactions?page=${page.value}&size=${size.value}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    )

    if (!response.ok) {
      throw new Error('Could not load transactions')
    }

    const data = await response.json()

    transactions.value = data.content
    totalPages.value = data.totalPages
    isFirst.value = data.first
    isLast.value = data.last
  } catch (err) {
    error.value = err.message
  }
}

async function nextPage() {
  if (!isLast.value) {
    page.value++
    await fetchTransactions()
  }
}

async function previousPage() {
  if (!isFirst.value) {
    page.value--
    await fetchTransactions()
  }
}

function formatMoney(value) {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR'
  }).format(value)
}

function formatDate(value) {
  return new Date(value).toLocaleString('nl-NL')
}

onMounted(fetchTransactions)
</script>