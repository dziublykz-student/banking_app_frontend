<template>
  <div class="approval-container">
    <div class="approval-card">
      
      <div class="icon">⏳</div>

      <h1>Welcome!</h1>

      <p class="message">
        Your account has been created successfully 🎉
      </p>

      <p class="sub-message">
        It is currently <strong>waiting for employee approval</strong>.
      </p>

      <p class="info">
        Once approved, you will gain full access to your banking features.
      </p>

      <button @click="logout" class="logout-btn">
        Logout
      </button>

    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function logout() {
  localStorage.clear()
  router.push('/login')
}
</script>