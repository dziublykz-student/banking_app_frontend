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

        <button
          class="nav-item"
          :class="{ active: activeTab === 'transactions' }"
          @click="activeTab = 'transactions'"
        >
          🔁 Transactions
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
          <h1>
            {{
              activeTab === 'users'
                ? 'Users'
                : activeTab === 'accounts'
                  ? 'Customer Accounts'
                  : 'Transactions'
            }}
          </h1>

          <p>
            {{
              activeTab === 'users'
                ? 'Manage customer approvals and account status'
                : activeTab === 'accounts'
                  ? 'View customer accounts and update transfer limits'
                  : 'View all customer transactions'
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

            <button class="change-btn" @click="viewCustomerTransactions(user)">
              View Transactions
            </button>

            <button class="close-btn" @click="closeUser(user.id)">
              Close
            </button>
          </div>
        </section>

        <section v-if="selectedTransactionCustomer" class="content-card">
          <div class="card-header">
            <div>
              <h2>Customer Transaction History</h2>
              <p>
                {{ selectedTransactionCustomer.firstName }}
                {{ selectedTransactionCustomer.lastName }}
                — {{ selectedTransactionCustomer.email }}
              </p>
            </div>

            <button class="close-panel-btn" @click="closeCustomerTransactionView">
              ✕
            </button>
          </div>

          <div v-if="customerTransactions.length === 0" class="empty-state">
            <h3>No transactions</h3>
            <p>This customer has no transactions yet.</p>
          </div>

          <div
            v-for="transaction in customerTransactions"
            :key="transaction.id"
            class="transaction-admin-row"
          >
            <div class="transaction-main">
              <h3>{{ formatMoney(transaction.amount) }}</h3>
              <span class="transaction-type">{{ transaction.type }}</span>
            </div>

            <div class="transaction-details">
              <p>
                <strong>From:</strong> {{ transaction.fromIban }}
              </p>
              <p>
                <strong>To:</strong> {{ transaction.toIban }}
              </p>
              <p>
                <strong>Description:</strong> {{ transaction.description || 'No description' }}
              </p>
            </div>

            <span class="transaction-date">
              {{ formatDate(transaction.timestamp) }}
            </span>
          </div>

          <div class="pagination-controls" v-if="customerTransactionTotalPages > 1">
            <button
              type="button"
              :disabled="customerTransactionIsFirst"
              @click="previousCustomerTransactionPage"
            >
              Previous
            </button>

            <span>
              Page {{ customerTransactionPage + 1 }} of {{ customerTransactionTotalPages }}
            </span>

            <button
              type="button"
              :disabled="customerTransactionIsLast"
              @click="nextCustomerTransactionPage"
            >
              Next
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

      <div v-if="activeTab === 'transactions'">
        <section class="content-card">
          <div class="card-header">
            <h2>All Transactions</h2>
            <span>{{ transactions.length }} transactions</span>
          </div>

          <div v-if="transactions.length === 0" class="empty-state">
            <h3>No transactions</h3>
            <p>Transactions will appear here after customers make transfers.</p>
          </div>

          <div
            v-for="transaction in transactions"
            :key="transaction.id"
            class="transaction-admin-row"
          >
            <div class="transaction-main">
              <h3>{{ formatMoney(transaction.amount) }}</h3>
              <span class="transaction-type">{{ transaction.type }}</span>
            </div>

            <div class="transaction-details">
              <p>
                <strong>From:</strong> {{ transaction.fromIban }}
              </p>
              <p>
                <strong>To:</strong> {{ transaction.toIban }}
              </p>
              <p>
                <strong>Description:</strong> {{ transaction.description || 'No description' }}
              </p>
            </div>

            <span class="transaction-date">
            {{ formatDate(transaction.timestamp) }}
            </span>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
const API_DOMAIN = import.meta.env.VITE_API_DOMAIN

const router = useRouter()

const users = ref([])
const approvedUsers = ref([])
const closedUsers = ref([])
const activeTab = ref('users')

const customerAccounts = ref([])
const selectedCustomer = ref(null)

const transactions = ref([])
const selectedTransactionCustomer = ref(null)
const customerTransactions = ref([])
const customerTransactionPage = ref(0)
const customerTransactionSize = ref(5)
const customerTransactionTotalPages = ref(0)
const customerTransactionIsFirst = ref(true)
const customerTransactionIsLast = ref(true)

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

function formatDate(value) {
  return new Date(value).toLocaleString('nl-NL')
}

function logout() {
  localStorage.clear()
  router.push('/login')
}

async function fetchPendingUsers() {
  try {
    const response = await fetch(`${API_DOMAIN}/users/pending`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })

    if (!response.ok) {
      throw new Error('Could not fetch pending users')
    }

    users.value = await response.json()
  } catch (err) {
    console.error(err)
  }
}

async function fetchApprovedUsers() {
  try {
    const response = await fetch(`${API_DOMAIN}/users/approved`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })

    if (!response.ok) {
      throw new Error('Could not fetch approved users')
    }

    approvedUsers.value = await response.json()
  } catch (err) {
    console.error(err)
  }
}

async function fetchClosedUsers() {
  try {
    const response = await fetch(`${API_DOMAIN}/users/closed`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })

    if (!response.ok) {
      throw new Error('Could not fetch closed users')
    }

    closedUsers.value = await response.json()
  } catch (err) {
    console.error(err)
  }
}

async function approveUser(id) {
  try {
    const response = await fetch(`${API_DOMAIN}/users/${id}/approve`, {
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
    await fetchCustomerAccounts()
  } catch (err) {
    console.error(err)
  }
}

async function closeUser(id) {
  try {
    const response = await fetch(`${API_DOMAIN}/users/${id}/close`, {
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

    await fetchCustomerAccounts()
  } catch (err) {
    console.error(err)
  }
}

async function fetchCustomerAccounts() {
  try {
    const response = await fetch(`${API_DOMAIN}/accounts/employee/customer-accounts?page=0&size=50`, {
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
  const response = await fetch(`${API_DOMAIN}/accounts/${account.id}/limits`, {
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

async function fetchTransactions() {
  try {
    const response = await fetch(`${API_DOMAIN}/transactions`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })

    if (!response.ok) {
      throw new Error('Could not fetch transactions')
    }

    transactions.value = await response.json()
  } catch (err) {
    console.error(err)
  }
}

async function viewCustomerTransactions(customer) {
  selectedTransactionCustomer.value = customer
  customerTransactionPage.value = 0
  await fetchCustomerTransactions()
}

async function fetchCustomerTransactions() {
  if (!selectedTransactionCustomer.value) {
    return
  }

  try {
    const response = await fetch(
      `${API_DOMAIN}/transactions/customer/${selectedTransactionCustomer.value.id}?page=${customerTransactionPage.value}&size=${customerTransactionSize.value}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    )

    if (!response.ok) {
      throw new Error('Could not fetch customer transactions')
    }

    const data = await response.json()

    customerTransactions.value = data.content
    customerTransactionTotalPages.value = data.totalPages
    customerTransactionIsFirst.value = data.first
    customerTransactionIsLast.value = data.last
  } catch (err) {
    console.error(err)
  }
}

async function nextCustomerTransactionPage() {
  if (!customerTransactionIsLast.value) {
    customerTransactionPage.value++
    await fetchCustomerTransactions()
  }
}

async function previousCustomerTransactionPage() {
  if (!customerTransactionIsFirst.value) {
    customerTransactionPage.value--
    await fetchCustomerTransactions()
  }
}

function closeCustomerTransactionView() {
  selectedTransactionCustomer.value = null
  customerTransactions.value = []
  customerTransactionPage.value = 0
}

onMounted(() => {
  fetchPendingUsers()
  fetchApprovedUsers()
  fetchClosedUsers()
  fetchCustomerAccounts()
  fetchTransactions()
})
</script>


<style>
.transaction-admin-row {
  display: grid;
  grid-template-columns: 180px 1fr 190px;
  gap: 24px;
  align-items: center;
  padding: 22px 0;
  border-bottom: 1px solid #e5e7eb;
}

.transaction-main h3 {
  margin: 0 0 8px;
  font-size: 20px;
  color: #111827;
}

.transaction-type {
  display: inline-block;
  padding: 5px 12px;
  border-radius: 999px;
  background: #eef2ff;
  color: #3730a3;
  font-size: 13px;
  font-weight: 700;
}

.transaction-details p {
  margin: 4px 0;
  color: #4b5563;
  word-break: break-all;
}

.transaction-date {
  justify-self: end;
  padding: 8px 14px;
  border-radius: 999px;
  background: #fff7ed;
  color: #c2410c;
  font-size: 14px;
  white-space: nowrap;
}
</style>