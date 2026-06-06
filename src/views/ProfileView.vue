<template>
  <div class="bank-page">

    <header class="top-bar">
      <div>
        <p class="label">Account</p>
        <h1>My Profile</h1>
      </div>
      <button class="logout-btn" @click="logout">Logout</button>
    </header>

    <p v-if="error" class="error-message">{{ error }}</p>

    <section class="accounts">
      <h2>Personal information</h2>

      <div v-for="item in profileItems" :key="item.label" class="account-card">
        <p><strong>{{ item.label }}</strong></p>
        <p>{{ item.value }}</p>
      </div>
    </section>

    <section class="accounts">
      <h2>Account status</h2>

      <div class="account-card">
        <p><strong>Role</strong></p>
        <p>{{ profile.role }}</p>
      </div>
      <div class="account-card">
        <p><strong>Status</strong></p>
        <p>{{ profile.approved ? 'Approved' : 'Pending approval' }}</p>
      </div>
    </section>

    <nav class="bottom-nav">
      <button @click="router.push('/dashboard')">Home</button>
      <button class="active">Profile</button>
      <button @click="router.push('/help')">Help</button>
    </nav>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'











































































































































import { useRouter } from 'vue-router'

const router = useRouter()
const token  = localStorage.getItem('token')
const error  = ref('')

const profile = ref({
  firstName:   '',
  lastName:    '',
  email:       '',
  phoneNumber: '',
  bsn:         '',
  role:        '',
  approved:    false
})

const profileItems = computed(() => [
  { label: 'Full name', value: `${profile.value.firstName} ${profile.value.lastName}` },
  { label: 'Email',     value: profile.value.email },
  { label: 'Phone',     value: profile.value.phoneNumber },
  { label: 'BSN',       value: profile.value.bsn }
])

async function fetchProfile() {
  try {
    const res = await fetch('http://localhost:8080/users/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (!res.ok) throw new Error('Could not load profile')
    profile.value = await res.json()
  } catch (err) {
    error.value = err.message
  }
}

function logout() {
  localStorage.clear()
  router.push('/login')
}

onMounted(fetchProfile)
</script>