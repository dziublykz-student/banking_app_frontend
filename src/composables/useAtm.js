import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getMyCheckingAccount, deposit, withdraw, logout } from '../services/atmService.js'

/**
 * ATM screen logic with a two-step flow:
 *   step 'choose'  → pick Deposit or Withdraw
 *   step 'amount'  → enter amount and confirm
 *
 * The view binds to what this returns — no logic lives in the .vue file.
 */
export function useAtm() {
  const router = useRouter()

  const account = ref(null)
  const amount = ref('')
  const status = ref('')
  const error = ref('')
  const loading = ref(false)

  const step = ref('choose')      // 'choose' | 'amount'
  const operation = ref('')       // 'deposit' | 'withdraw'

  const formattedBalance = computed(() =>
    account.value ? `€ ${Number(account.value.balance).toFixed(2)}` : ''
  )

  const operationLabel = computed(() =>
    operation.value === 'deposit' ? 'Deposit' : 'Withdrawal'
  )

  async function loadAccount() {
    try {
      account.value = await getMyCheckingAccount()
    } catch (err) {
      error.value = err.message
    }
  }

  // Step 1 → pick the operation and move to the amount screen
  function chooseOperation(op) {
    operation.value = op
    amount.value = ''
    status.value = ''
    error.value = ''
    step.value = 'amount'
  }

  // Step 2 → confirm the amount
  async function confirm() {
    status.value = ''
    error.value = ''
    loading.value = true
    try {
      const value = Number(amount.value)
      if (operation.value === 'deposit') {
        await deposit(account.value.iban, value)
      } else {
        await withdraw(account.value.iban, value, Number(account.value.balance))
      }
      await loadAccount() // refresh balance from backend
      status.value = `✓ ${operationLabel.value} of € ${value.toFixed(2)} successful.`
      backToMenu()
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  function backToMenu() {
    step.value = 'choose'
    operation.value = ''
    amount.value = ''
    error.value = ''
  }

  function onLogout() {
    logout()
    router.push('/atm-login')
  }

  onMounted(loadAccount)

  return {
    account,
    amount,
    status,
    error,
    loading,
    step,
    operation,
    operationLabel,
    formattedBalance,
    chooseOperation,
    confirm,
    backToMenu,
    onLogout,
  }
}