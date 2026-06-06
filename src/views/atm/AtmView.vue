<template>
  <div class="atm-container">
    <div class="atm-card">
      <h1>🏧 ATM</h1>

      <template v-if="account">
        <p class="iban">{{ account.iban }}</p>
        <p class="balance">{{ formattedBalance }}</p>

        <!-- Step 1: choose operation -->
        <div v-if="step === 'choose'" class="actions">
          <button class="deposit" @click="chooseOperation('deposit')">Deposit</button>
          <button class="withdraw" @click="chooseOperation('withdraw')">Withdraw</button>
        </div>

        <!-- Step 2: enter amount -->
        <form v-else @submit.prevent="confirm" class="atm-form">
          <p class="operation-title">{{ operationLabel }}</p>

          <div class="form-group">
            <label for="amount">Amount (€)</label>
            <input id="amount" v-model="amount" type="number" min="0.01" step="0.01" autofocus />
          </div>

          <div class="actions">
            <button type="button" class="back" @click="backToMenu">Back</button>
            <button type="submit" class="confirm" :disabled="loading">
              {{ loading ? 'Processing…' : 'Confirm' }}
            </button>
          </div>
        </form>

        <p v-if="status" class="success-message">{{ status }}</p>
        <p v-if="error" class="error-message">{{ error }}</p>

        <button class="logout" @click="onLogout">Logout</button>
      </template>

      <p v-else-if="error" class="error-message">{{ error }}</p>
      <p v-else class="loading">Loading account…</p>
    </div>
  </div>
</template>

<script setup>
import '@/assets/atm.css'
import { useAtm } from '../../composables/useAtm.js'

const {
  account,
  amount,
  status,
  error,
  loading,
  step,
  operationLabel,
  formattedBalance,
  chooseOperation,
  confirm,
  backToMenu,
  onLogout,
} = useAtm()
</script>