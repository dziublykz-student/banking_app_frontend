import { createRouter, createWebHashHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import DashboardView from '../views/DashboardView.vue'
import PendingApprovalView from '../views/PendingApprovalView.vue'
import EmployeeDashboardView from '../views/EmployeeDashboardView.vue'
import ProfileView from '../views/ProfileView.vue'
import LandingView from '../views/LandingView.vue'
//import ProfileView from '../views/ProfileView.vue'
//import HelpView from '../views/HelpView.vue'
import TransferView from '../views/TransferView.vue'
import TransactionsView from '../views/TransactionsView.vue'
import AtmLoginView from '../views/atm/AtmLoginView.vue'
import AtmView from '../views/atm/AtmView.vue'

const routes = [
  { path: '/', name: 'landing', component: LandingView },   
  { path: '/login', name: 'login', component: LoginView },
  { path: '/register', name: 'register', component: RegisterView },
  { path: '/pending-approval', name: 'pendingApproval', component: PendingApprovalView },

  { path: '/dashboard', name: 'dashboard', component: DashboardView },
  { path: '/transfer', name: 'transfer', component: TransferView },
  //{ path: '/help', name: 'help', component: HelpView },
  { path: '/profile', name: 'profile', component: ProfileView },
  { path: '/transactions', name: 'transactions', component: TransactionsView },

  { path: '/employee-dashboard', name: 'employeeDashboard', component: EmployeeDashboardView },

  { path: '/atm-login', name: 'atmLogin', component: AtmLoginView },
  { path: '/atm',       name: 'atm',      component: AtmView },
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes
})

export default router