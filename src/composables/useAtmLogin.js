import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '../services/atmService.js'

/**
 * ATM login logic.
 * The view binds to what this returns — no logic lives in the .vue file.
 */
export function useAtmLogin() {
  const router = useRouter()
  const form = reactive({ email: '', password: '' })
  const error = ref('')
  const loading = ref(false)

  async function onLogin() {
    error.value = ''
    loading.value = true
    try {
      await login(form.email, form.password)
      router.push('/atm')
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  return { form, error, loading, onLogin }
}