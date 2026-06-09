<template>
  <div class="bank-page">
    <button class="back-btn" @click="router.push('/dashboard')">← Back</button>
    <header class="top-bar">
      <div>
        <p class="label">Transactions</p>
        <h1>Recent transactions</h1>
      </div>
    </header>

    <section class="transaction-filters">
      <input
        v-model="ibanFilter"
        type="text"
        placeholder="Filter by IBAN"
      />

      <input
        v-model="startDateFilter"
        type="date"
      />

      <input
        v-model="endDateFilter"
        type="date"
      />

      <input
        v-model="amountFilterValue"
        type="number"
        min="0.01"
        step="0.01"
        placeholder="Amount"
      />

      <select v-model="amountFilterType">
        <option value="">Amount Filter</option>
        <option value="LESS_THAN">Less than</option>
        <option value="GREATER_THAN">Greater than</option>
        <option value="EQUAL_TO">Equal to</option>
      </select>
      
      <button type="button" @click="applyFilters">
        Search
      </button>
      <button type="button" @click="clearFilters">
        Clear
      </button>
    </section>

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
const API_DOMAIN = import.meta.env.VITE_API_DOMAIN

const router = useRouter()

const transactions = ref([])
const error = ref('')

const page = ref(0)
const size = ref(5)
const totalPages = ref(0)
const isFirst = ref(true)
const isLast = ref(true)
const ibanFilter = ref('')
const startDateFilter = ref('')
const endDateFilter = ref('')
const amountFilterValue = ref('')
const amountFilterType = ref('')

async function fetchTransactions() {
  error.value = ''

  try {
    let url = `${API_DOMAIN}/transactions/my-transactions?page=${page.value}&size=${size.value}`
    if (ibanFilter.value.trim()) {
      url += `&iban=${encodeURIComponent(ibanFilter.value.trim())}`
    }

    if (startDateFilter.value && endDateFilter.value) {
      url += `&startDate=${startDateFilter.value}&endDate=${endDateFilter.value}`
    }
    
    if (amountFilterValue.value && amountFilterType.value) {
      url += `&amount=${encodeURIComponent(amountFilterValue.value)}`
      url += `&amountFilter=${amountFilterType.value}`
    }

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })

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

async function applyFilters() {
  page.value = 0
  await fetchTransactions()
}

async function clearFilters() {
  ibanFilter.value = ''
  startDateFilter.value = ''
  endDateFilter.value = ''
  amountFilterValue.value = ''
  amountFilterType.value = ''
  page.value = 0
  await fetchTransactions()
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

<style>
.form-group input,
.form-group select,
.form-group textarea,
.login-card input,
.register-card input,
.transfer-card input,
.transfer-card select,
.transfer-card textarea {
  color: #111827;
  background-color: #ffffff;
}

.form-group input::placeholder,
.form-group textarea::placeholder,
.login-card input::placeholder,
.register-card input::placeholder,
.transfer-card input::placeholder,
.transfer-card textarea::placeholder {
  color: #9ca3af;
  opacity: 1;
}

.transfer-card select option {
  color: #111827;
  background-color: #ffffff;
}
</style>