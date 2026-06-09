<template>
  <div class="auth-container">
    <div class="auth-card">
      <h1>Login</h1>

      <form @submit.prevent="loginUser" class="auth-form">
        <div class="form-group">
          <label for="email">Email</label>
          <input id="email" v-model="form.email" type="email" required />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input id="password" v-model="form.password" type="password" required />
        </div>

        <button type="submit">Login</button>
      </form>

      <p v-if="message" class="success-message">{{ message }}</p>
      <p v-if="error" class="error-message">{{ error }}</p>

      <p class="auth-switch">
        Don’t have an account?
        <router-link to="/register">Register</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
const API_DOMAIN = import.meta.env.VITE_API_DOMAIN

const form = reactive({
  email: '',
  password: ''
})

const router = useRouter()

const message = ref('')
const error = ref('')

async function loginUser() {
  message.value = ''
  error.value = ''

  try {
    const response = await fetch(`${API_DOMAIN}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(form)
    })

    const text = await response.text()
    const data = text ? JSON.parse(text) : {}

    if (!response.ok) {
      throw new Error(data.message || 'Login failed')
    }

    message.value = data.message || 'Login successful'

    localStorage.setItem('token', data.token)
    localStorage.setItem('role', data.role)
    localStorage.setItem('approved', data.approved)
    localStorage.setItem('email', form.email)

    if (data.role === 'EMPLOYEE') {
      router.push('/employee-dashboard')
    } else if (data.approved) {
      router.push('/dashboard')
    } else {
      router.push('/pending-approval')
    } 

    form.email = ''
    form.password = ''
  } catch (err) {
    error.value = err.message
  }
}
</script>
