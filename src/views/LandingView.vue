<template>
  <div class="landing-container">
    <div class="landing-card">
      <h1>Inholland Bank</h1>
      <p class="subtitle">How would you like to continue?</p>

      <div class="landing-actions">
        <button class="landing-option online" @click="router.push('/login')">
          <div class="icon">💻</div>
          <h2>Online Banking</h2>
          <p>Manage your accounts, transfer money, view transactions</p>
        </button>

        <button class="landing-option atm" @click="router.push('/atm-login')">
          <div class="icon">🏧</div>
          <h2>ATM</h2>
          <p>Deposit or withdraw money from your account</p>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import '@/assets/landing.css'
import { useRouter } from 'vue-router'
const router = useRouter()
</script>