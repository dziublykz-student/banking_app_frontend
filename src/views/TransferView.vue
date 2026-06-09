<template>
  <div class="transfer-page">
    <div class="transfer-card">
      <button class="back-btn" @click="router.push('/dashboard')">← Back</button>

      <h1>Transfer Money</h1>
      <p class="subtitle">Move money between your own accounts or send it to another customer.</p>

      <div class="transfer-tabs">
        <button :class="{ active: transferType === 'own' }" @click="transferType = 'own'">
          Own accounts
        </button>
        <button :class="{ active: transferType === 'other' }" @click="transferType = 'other'">
          Other customer
        </button>
      </div>

      <form @submit.prevent="submitTransfer" class="transfer-form">
        <div class="form-group">
          <label>From account</label>
          <select v-model="form.fromIban" required>
            <option value="">Select account</option>
            <option v-for="account in accounts" :key="account.id" :value="account.iban">
              {{ account.type }} - {{ account.iban }} - {{ formatMoney(account.balance)}}
            </option>
          </select>
        </div>

        <div v-if="transferType === 'own'" class="form-group">
          <label>To account</label>
          <select v-model="form.toIban" required>
            <option value="">Select account</option>
            <option v-for="account in accounts"
              :key="account.id"
              :value="account.iban">
              {{ account.type }} - {{ account.iban }} - {{ formatMoney(account.balance)}}
            </option>
          </select>
        </div>

        <div v-if="transferType === 'other'" class="iban-search">
            <h2>Find recipient IBAN</h2>

            <div class="search-row">
                <input v-model="search.firstName" type="text" placeholder="First name" />
                <input v-model="search.lastName" type="text" placeholder="Last name" />
                <button type="button" @click="searchIbans">Search</button>
            </div>

            <div v-for="result in searchResults" :key="result.iban" class="iban-result">
                <div>
                <strong>{{ result.fullName }}</strong>
                <p>{{ result.accountType }} • {{ result.iban }}</p>
                </div>

                <button type="button" @click="form.recipient = result.iban">
                Use IBAN
                </button>
            </div>
        </div>

        <div v-if="transferType === 'other'" class="form-group">
          <label>Recipient IBAN</label>
          <input v-model="form.recipient" type="text" placeholder="IBAN" required />
        </div>

        <div class="form-group">
          <label>Amount</label>
          <input v-model="form.amount" type="number" min="0.01" step="0.01" required />
        </div>

        <div class="form-group">
          <label>Description</label>
          <input v-model="form.description" type="text" placeholder="Optional" />
        </div>

        <button type="submit" class="transfer-btn">Transfer</button>
      </form>

      <p v-if="message" class="success-message">{{ message }}</p>
      <p v-if="error" class="error-message">{{ error }}</p>
    </div>
  </div>
</template>


<script setup>
import { reactive, ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
const API_DOMAIN = import.meta.env.VITE_API_DOMAIN

const router = useRouter()
const transferType = ref('own')
const message = ref('')
const error = ref('')
const accounts = ref([])

const form = reactive({
  fromIban: '',
  toIban: '',
  recipient: '',
  amount: '',
  description: ''
})

const search = reactive({
  firstName: '',
  lastName: ''
})

const searchResults = ref([])

watch(transferType, () => {
  form.toIban = ''
  form.recipient = ''
  search.firstName = ''
  search.lastName = ''
  searchResults.value = []
  message.value = ''
  error.value = ''
})

async function fetchAccounts() {
  try {
    const response = await fetch(`${API_DOMAIN}/accounts/my-accounts`, {
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

async function searchIbans() {
  error.value = ''

  try {
    const params = new URLSearchParams()

    if (search.firstName.trim()) {
      params.append('firstName', search.firstName.trim())
    }

    if (search.lastName.trim()) {
      params.append('lastName', search.lastName.trim())
    }

    const response = await fetch(
      `${API_DOMAIN}/users/search-ibans?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    )

    if (!response.ok) {
      throw new Error('Could not search IBANs')
    }

    searchResults.value = await response.json()
  } catch (err) {
    error.value = err.message
  }
}

async function submitTransfer() {
  message.value = ''
  error.value = ''

  const toIban = transferType.value === 'own'
    ? form.toIban
    : form.recipient

  if (form.fromIban === toIban) {
    error.value = 'You cannot transfer to the same account.'
    return
  }

  try {
    const response = await fetch(`${API_DOMAIN}/transactions/transfer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        fromIban: form.fromIban,
        toIban: toIban,
        amount: Number(form.amount),
        description: form.description
      })
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      throw new Error(data.message || 'Transfer failed')
    }

    message.value = 'Transfer completed successfully.'

    form.fromIban = ''
    form.toIban = ''
    form.recipient = ''
    form.amount = ''
    form.description = ''

    await fetchAccounts()
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

onMounted(fetchAccounts)
</script>

<style>
.form-group input,
.form-group select,
.form-group textarea,
.auth-card input,
.transfer-card input,
.transfer-card select,
.transfer-card textarea {
  color: #111827;
  background-color: #ffffff;
}

.form-group input::placeholder,
.form-group textarea::placeholder,
.auth-card input::placeholder,
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