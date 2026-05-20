<template>
  <div class="admin-layout">
    <aside class="sidebar">
      <h2>Bank Admin</h2>

      <nav>
        <button
          class="nav-item"
          :class="{ active: activeTab === 'users' }"
          @click="activeTab = 'users'"
        >
          👥 Users
        </button>

        <button
          class="nav-item"
          :class="{ active: activeTab === 'accounts' }"
          @click="activeTab = 'accounts'"
        >
          💳 Customer Limits
        </button>
      </nav>

      <button class="logout-btn" @click="logout">Logout</button>
    </aside>

    <main class="main-content">

      <header class="top-section">

        <p v-if="successMessage" class="success-message">
            {{ successMessage }}
        </p>

        <p v-if="errorMessage" class="error-message">
            {{ errorMessage }}
        </p>
        
        <div>
          <h1>{{ activeTab === 'users' ? 'Users' : 'Customer Accounts' }}</h1>
          <p>
            {{
              activeTab === 'users'
                ? 'Manage customer approvals and account status'
                : 'View customer accounts and update transfer limits'
            }}
          </p>
        </div>
      </header>
    

      <div v-if="activeTab === 'users'">
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

            <button class="close-btn" @click="closeUser(user.id)">
              Close
            </button>
          </div>
        </section>

        <section class="content-card closed-section">
          <div class="card-header">
            <h2>Closed Customers</h2>
            <span>{{ closedUsers.length }} closed</span>
          </div>

          <div v-if="closedUsers.length === 0" class="empty-state">
            <h3>No closed customers</h3>
            <p>There are currently no closed customer accounts.</p>
          </div>

          <div v-for="user in closedUsers" :key="user.id" class="user-row">
            <div class="avatar">
              {{ user.firstName.charAt(0) }}{{ user.lastName.charAt(0) }}
            </div>

            <div class="user-info">
              <h3>{{ user.firstName }} {{ user.lastName }}</h3>
              <p>{{ user.email }}</p>
            </div>

            <span class="closed-status">Closed</span>
          </div>
        </section>
      </div>

      <div v-if="activeTab === 'accounts'">
        <section class="content-card">
          <div class="card-header">
            <h2>Customer Accounts</h2>
            <span>{{ groupedCustomerAccounts.length }} customers</span>
          </div>

          <div v-if="groupedCustomerAccounts.length === 0" class="empty-state">
            <h3>No customer accounts</h3>
            <p>Approved customer accounts will appear here.</p>
          </div>

          <div
            v-for="customer in groupedCustomerAccounts"
            :key="customer.customerEmail"
            class="customer-account-row"
          >
            <div class="avatar">
              {{ customer.customerName.split(' ')[0].charAt(0) }}
              {{ customer.customerName.split(' ')[1]?.charAt(0) }}
            </div>

            <div class="user-info">
              <h3>{{ customer.customerName }}</h3>
              <p>{{ customer.customerEmail }}</p>
            </div>

            <div class="balance-info">
              <p>{{ customer.accounts.length }} accounts • Total balance</p>
              <strong>{{ formatMoney(customer.totalBalance) }}</strong>
            </div>

            <button class="change-btn" @click="selectedCustomer = customer">
              Change Limits
            </button>
          </div>
        </section>

        <section v-if="selectedCustomer" class="content-card limits-section">
          <div class="card-header">
            <div>
              <h2>Change Limits</h2>
              <p>{{ selectedCustomer.customerName }} — {{ selectedCustomer.customerEmail }}</p>
            </div>

            <button class="close-panel-btn" @click="selectedCustomer = null">
              ✕
            </button>
          </div>

          <div
            v-for="account in selectedCustomer.accounts"
            :key="account.id"
            class="limit-account-row"
          >
            <div>
              <h3>{{ account.type }} account</h3>
              <p>{{ account.iban }}</p>
              <p>Balance: {{ formatMoney(account.balance) }}</p>
            </div>

            <div class="limit-inputs">
              <label>
                Absolute limit
                <input v-model="account.absoluteTransferLimit" type="number" />
              </label>

              <label>
                Daily limit
                <input v-model="account.dailyTransferLimit" type="number" />
              </label>
            </div>
          </div>

          <div class="limit-actions">
            <button class="cancel-btn" @click="selectedCustomer = null">
              Cancel
            </button>

            <button class="save-btn" @click="saveCustomerLimits">
              Save Changes
            </button>
          </div>
        </section>

      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const users = ref([])
const approvedUsers = ref([])
const closedUsers = ref([])
const activeTab = ref('users')
const customerAccounts = ref([])
const selectedCustomer = ref(null)
const successMessage = ref('')
const errorMessage = ref('')

const groupedCustomerAccounts = computed(() => {
  const groups = {}

  customerAccounts.value.forEach(account => {
    if (!groups[account.customerEmail]) {
      groups[account.customerEmail] = {
        customerName: account.customerName,
        customerEmail: account.customerEmail,
        totalBalance: 0,
        accounts: []
      }
    }

    groups[account.customerEmail].totalBalance += Number(account.balance)
    groups[account.customerEmail].accounts.push(account)
  })

  return Object.values(groups)
})

function formatMoney(value) {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR'
  }).format(value)
}

async function saveCustomerLimits() {
  successMessage.value = ''
  errorMessage.value = ''

  try {
    for (const account of selectedCustomer.value.accounts) {
      await updateLimits(account)
    }

    await fetchCustomerAccounts()

    successMessage.value = 'Limits updated successfully.'
    selectedCustomer.value = null

    setTimeout(() => {
      successMessage.value = ''
    }, 2000)

  } catch (err) {
    console.error(err)

    errorMessage.value = 'Could not update limits.'

    setTimeout(() => {
      errorMessage.value = ''
    }, 3000)
  }
}

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
    console.log('Approved users:', approvedUsers.value)
    
  } catch (err) {
    console.error('Could not fetch approved users', err)
  }
    
}

async function fetchClosedUsers() {
  try {
    const response = await fetch('http://localhost:8080/users/closed', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })

    if (!response.ok) {
      throw new Error('Could not fetch closed users')
    }

    closedUsers.value = await response.json()
  } catch (err) {
    console.error('Could not fetch closed users', err)
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
      throw new Error('Could not approve user')
    }

    const approvedUser = await response.json()

    users.value = users.value.filter(user => user.id !== id)

    approvedUsers.value.push(approvedUser)

    await fetchApprovedUsers() 

  } catch (err) {
    console.error(err)
  }
}

async function closeUser(id) {
  try {
    const response = await fetch(`http://localhost:8080/users/${id}/close`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })

    if (!response.ok) {
      throw new Error('Could not close user')
    }

    const closedUser = await response.json()

    approvedUsers.value = approvedUsers.value.filter(user => user.id !== id)

    closedUsers.value.push(closedUser)

  } catch (err) {
    console.error(err)
  }
}

async function fetchCustomerAccounts() {
  try {
    const response = await fetch('http://localhost:8080/accounts/employee/customer-accounts?page=0&size=50', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })

    if (!response.ok) {
      throw new Error('Could not fetch customer accounts')
    }

    const data = await response.json()
    customerAccounts.value = data.content
  } catch (err) {
    console.error(err)
  }
}

async function updateLimits(account) {
  try {
    const response = await fetch(`http://localhost:8080/accounts/${account.id}/limits`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        absoluteTransferLimit: account.absoluteTransferLimit,
        dailyTransferLimit: account.dailyTransferLimit
      })
    })

    if (!response.ok) {
      throw new Error('Could not update limits')
    }

    await fetchCustomerAccounts()
  } catch (err) {
    console.error(err)
  }
}

onMounted(() => {
  fetchPendingUsers()
  fetchApprovedUsers()
  fetchClosedUsers()
  fetchCustomerAccounts()
})
</script>