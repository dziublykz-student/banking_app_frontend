<template>
  <div class="admin-layout">
    <aside class="sidebar">
      <h2>Bank Admin</h2>

      <nav>
        <button class="nav-item active">Users</button>
      </nav>

      <button class="logout-btn" @click="logout">Logout</button>
    </aside>

    <main class="main-content">
      <header class="top-section">
        <div>
          <h1>Users</h1>
          <p>Manage customer approvals</p>
        </div>
      </header>

      <section class="content-card">
        <div class="card-header">
          <h2>Pending Users</h2>
          <span>{{ users.length }} waiting</span>
        </div>

        <div v-if="users.length === 0" class="empty-state">
          <h3>No pending users</h3>
          <p>There are currently no customers waiting for approval.</p>
        </div>

        <div v-for="user in users" :key="user.id" class="user-row">
          <div class="avatar">
            {{ user.firstName.charAt(0) }}{{ user.lastName.charAt(0) }}
          </div>

          <div class="user-info">
            <h3>{{ user.firstName }} {{ user.lastName }}</h3>
            <p>{{ user.email }}</p>
          </div>

          <span class="status">Pending</span>

          <button class="approve-btn" @click="approveUser(user.id)">
            Approve
          </button>
        </div>
      </section>

      <section class="content-card approved-section">
        <div class="card-header">
          <h2>Approved Customers</h2>
          <span>{{ approvedUsers.length }} approved</span>
        </div>

        <div v-if="approvedUsers.length === 0" class="empty-state">
          <h3>No approved customers</h3>
          <p>There are currently no approved customers.</p>
        </div>

        <div v-for="user in approvedUsers" :key="user.id" class="user-row">
          <div class="avatar">
            {{ user.firstName.charAt(0) }}{{ user.lastName.charAt(0) }}
          </div>

          <div class="user-info">
            <h3>{{ user.firstName }} {{ user.lastName }}</h3>
            <p>{{ user.email }}</p>
          </div>

          <span class="approved-status">Approved</span>
        </div>
      </section>

    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const users = ref([])
const approvedUsers = ref([])

function logout() {
  localStorage.clear()
  router.push('/login')
}

async function fetchPendingUsers() {
  const response = await fetch('http://localhost:8080/users/pending', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  })

  users.value = await response.json()
}

async function fetchApprovedUsers() {
  try {
    const response = await fetch('http://localhost:8080/users/approved', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })

    approvedUsers.value = await response.json()
    
  } catch (err) {
    console.error('Could not fetch approved users', err)
  }
    
}

async function approveUser(id) {
  try {
    const response = await fetch(`http://localhost:8080/users/${id}/approve`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })

    if (!response.ok) {
      const text = await response.text()
      console.error(text)
      throw new Error('Could not approve user')
    }

    await fetchPendingUsers()
    await fetchApprovedUsers()

  } catch (err) {
    console.error(err)
  }
}

onMounted(() => {
  fetchPendingUsers()
  fetchApprovedUsers()
})
</script>