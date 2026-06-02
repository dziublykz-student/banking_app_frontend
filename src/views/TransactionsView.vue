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

async function fetchTransactions() {
  error.value = ''

  try {
    const response = await fetch('http://localhost:8080/transactions/my-transactions', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })

    if (!response.ok) {
      throw new Error('Could not load transactions')
    }

    transactions.value = await response.json()
  } catch (err) {
    error.value = err.message
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