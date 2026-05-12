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
      <div v-for="transaction in transactions" :key="transaction.id" class="transaction-row">

        <div>
          <p>{{ transaction.description }}</p>
          <small>{{ transaction.timestamp }} • {{ transaction.type }}</small>
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

//Dummy data just to show the layout
const transactions = ref([
  {
    id: 1,
    description: 'Initial deposit',
    type: 'DEPOSIT',
    amount: 1850.75,
    timestamp: '2026-05-09'
  },
  {
    id: 2,
    description: 'Transfer to savings',
    type: 'TRANSFER',
    amount: 600.00,
    timestamp: '2026-05-10'
  },
  {
    id: 3,
    description: 'Grocery store',
    type: 'WITHDRAWAL',
    amount: 34.2,
    timestamp: '2026-05-11'
  }
])

function formatMoney(value) {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR'
  }).format(value)
}
</script>