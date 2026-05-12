<template>
  <div class="bank-page">
    <header class="top-bar">
      <div>
        <p class="label">Overview</p>
        <h1>Welcome, {{ firstName }}</h1>
      </div>

      <button class="logout-btn" @click="logout">Logout</button>
    </header>

    <section class="quick-actions">
      <button @click="goToTransfer">Transfer</button>
      <button @click="router.push('/transactions')">Transactions</button>
    </section>

    <section class="balance-card">
        <p>Total balance</p>
        <h2>{{ formatMoney(totalBalance) }}</h2>
        <span v-if="checkingAccount">
            Card number: **** {{ checkingAccount.iban.slice(-4) }}
        </span>
    </section>

    <section class="accounts">
        <h2>Your accounts</h2>

        <p v-if="error" class="error-message">{{ error }}</p>

        <div v-if="accounts.length === 0 && !error">
            No accounts found.
        </div>

        <div v-for="account in accounts" :key="account.id" class="account-card">
            <div>
            <h3>{{ account.type === 'CHECKING' ? 'Checking account' : 'Savings account' }}</h3>
            <p>{{ account.iban }}</p>
            </div>

            <strong>{{ formatMoney(account.balance) }}</strong>
        </div>
    </section>

    <nav class="bottom-nav">
        <button @click="router.push('/dashboard')" class="active">Home</button>
        <button @click="router.push('/profile')">Profile</button>
        <button @click="router.push('/help')">Help</button>
    </nav>

  </div>
</template>


<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const firstName = localStorage.getItem('firstName') || 'Customer'

const accounts = ref([])
const error = ref('')


const totalBalance = computed(() => {
  return accounts.value.reduce((total, account) => {
    return total + Number(account.balance)
  }, 0)
})


const checkingAccount = computed(() =>
  accounts.value.find(account => account.type === 'CHECKING')
)

async function fetchAccounts() {
  try {
    const response = await fetch('http://localhost:8080/accounts/my-accounts', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })

    if (!response.ok) {
      throw new Error('Could not load accounts')
    }

    accounts.value = await response.json()
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

function goToTransfer() {
  router.push('/transfer')
}

function logout() {
  localStorage.clear()
  router.push('/login')
}

onMounted(fetchAccounts)
</script>