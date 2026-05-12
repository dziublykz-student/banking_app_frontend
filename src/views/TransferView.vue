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
          <select v-model="form.fromAccount" required>
            <option value="">Select account</option>
            <option value="checking">Checking account</option>
            <option value="savings">Savings account</option>
          </select>
        </div>

        <div v-if="transferType === 'own'" class="form-group">
          <label>To account</label>
          <select v-model="form.toAccount" required>
            <option value="">Select account</option>
            <option value="checking">Checking account</option>
            <option value="savings">Savings account</option>
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
import { reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const transferType = ref('own')
const message = ref('')
const error = ref('')

const form = reactive({
  fromAccount: '',
  toAccount: '',
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
  form.toAccount = ''
  form.recipient = ''
  search.firstName = ''
  search.lastName = ''
  searchResults.value = []
  message.value = ''
  error.value = ''
})

async function searchIbans() {
  error.value = ''

  try {
    const response = await fetch(
      `http://localhost:8080/users/search-ibans?firstName=${search.firstName}&lastName=${search.lastName}`,
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

  if (transferType.value === 'own' && form.fromAccount === form.toAccount) {
    error.value = 'You cannot transfer to the same account.'
    return
  }

  console.log({
    transferType: transferType.value,
    ...form
  })

  message.value = 'Transfer submitted successfully.'

  form.fromAccount = ''
  form.toAccount = ''
  form.recipient = ''
  form.amount = ''
  form.description = ''
}
</script>