<template>
  <div class="atm-container">
    <div class="atm-card">
      <h1>🏧 ATM Login</h1>

      <form @submit.prevent="onLogin" class="atm-form">
        <div class="form-group">
          <label for="email">Email</label>
          <input id="email" v-model="form.email" type="email" required />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input id="password" v-model="form.password" type="password" required />
        </div>

        <button type="submit" :disabled="loading">
          {{ loading ? 'Logging in…' : 'Login' }}
        </button>
      </form>

      <p v-if="error" class="error-message">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import '@/assets/atm.css'
import { useAtmLogin } from '../../composables/useAtmLogin.js'

const { form, error, loading, onLogin } = useAtmLogin()
</script>