<template>
  <div class="auth-container">
    <div class="auth-card">
      <h1>Register</h1>

      <form @submit.prevent="registerUser" class="auth-form">
        <div class="form-group">
          <label for="firstName">First Name</label>
          <input id="firstName" v-model="form.firstName" type="text" required />
        </div>

        <div class="form-group">
          <label for="lastName">Last Name</label>
          <input id="lastName" v-model="form.lastName" type="text" required />
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input id="email" v-model="form.email" type="email" required />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input id="password" v-model="form.password" type="password" required />
        </div>

        <div class="form-group">
          <label for="bsn">BSN</label>
          <input id="bsn" v-model="form.bsn" type="text" required />
        </div>

        <div class="form-group">
          <label for="phoneNumber">Phone Number</label>
          <input id="phoneNumber" v-model="form.phoneNumber" type="text" required />
        </div>

        <button type="submit">Register</button>
      </form>

      <p v-if="message" class="success-message">{{ message }}</p>
      <p v-if="error" class="error-message">{{ error }}</p>

      <p class="auth-switch">
        Already have an account?
        <router-link to="/login">Login</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  bsn: '',
  phoneNumber: ''
})

const message = ref('')
const error = ref('')

async function registerUser() {
  message.value = ''
  error.value = ''

  try {
    const response = await fetch('http://localhost:8080/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(form)
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Registration failed')
    }

    message.value = data.message || 'Registration successful'

    form.firstName = ''
    form.lastName = ''
    form.email = ''
    form.password = ''
    form.bsn = ''
    form.phoneNumber = ''
  } catch (err) {
    error.value = err.message
  }
}
</script>