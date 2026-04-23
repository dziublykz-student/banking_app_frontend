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
    const response = await fetch('http://localhost:8080/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(form)
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Login failed')
    }

    message.value = data.message || 'Login successful'

    if (data.approved) {
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