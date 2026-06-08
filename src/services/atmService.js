import config from '../config.js'

/**
 * ATM Service
 *
 * Self-contained: all ATM backend calls and business rules live here.
 * Composables call these functions — views never see URLs or tokens.
 */

// ── Internal request helper (auth + JSON + errors in one place) ───────────────

function buildUrl(endpoint) {
  const base = config.apiDomain.replace(/\/$/, '')
  const path = endpoint.replace(/^\//, '')
  return `${base}/${path}`
}

function authHeader() {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function request(endpoint, { method = 'GET', body } = {}) {
  const response = await fetch(buildUrl(endpoint), {
    method,
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  })

  const text = await response.text()
  const data = text ? JSON.parse(text) : null

  if (!response.ok) throw new Error((data && data.message) || 'Request failed')
  return data
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export async function login(email, password) {
  const data = await request('/auth/login', { method: 'POST', body: { email, password } })
  localStorage.setItem('token', data.token)
  localStorage.setItem('role', data.role)
  return data
}

export function logout() {
  localStorage.clear()
}

// ── Accounts ──────────────────────────────────────────────────────────────────

/** The customer's active checking account, used for ATM operations. */
export async function getMyCheckingAccount() {
  const accounts = await request('/accounts/my-accounts')
  const checking = accounts.find((a) => a.active && a.type === 'CHECKING')
  if (!checking) throw new Error('No active checking account found.')
  return checking
}

// ── Deposit / Withdraw ────────────────────────────────────────────────────────

/** Deposit money into the user's own account. */
export function deposit(userIban, amount) {
  validateAmount(amount)
  return request('/atm/deposit', {
    method: 'POST',
    body: { iban: userIban, amount },
  })
}

/** Withdraw money from the user's own account. */
export function withdraw(userIban, amount, currentBalance) {
  validateAmount(amount)
  if (amount > currentBalance) throw new Error('Insufficient balance.')
  return request('/atm/withdraw', {
    method: 'POST',
    body: { iban: userIban, amount },
  })
}

// ── Validation ────────────────────────────────────────────────────────────────

function validateAmount(amount) {
  if (!amount || Number(amount) <= 0) {
    throw new Error('Enter an amount greater than €0.00.')
  }
}