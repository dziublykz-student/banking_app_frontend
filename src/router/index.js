import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import DashboardView from '../views/DashboardView.vue'
import PendingApprovalView from '../views/PendingApprovalView.vue'
import EmployeeDashboardView from '../views/EmployeeDashboardView.vue'
//import ProfileView from '../views/ProfileView.vue'
//import HelpView from '../views/HelpView.vue'
import TransferView from '../views/TransferView.vue'
import TransactionsView from '../views/TransactionsView.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'login', component: LoginView },
  { path: '/register', name: 'register', component: RegisterView },
  { path: '/pending-approval', name: 'pendingApproval', component: PendingApprovalView },

  { path: '/dashboard', name: 'dashboard', component: DashboardView },
  { path: '/transfer', name: 'transfer', component: TransferView },
  //{ path: '/help', name: 'help', component: HelpView },
  //{ path: '/profile', name: 'profile', component: ProfileView },
  { path: '/transactions', name: 'transactions', component: TransactionsView}, 

  { path: '/employee-dashboard', name: 'employeeDashboard', component: EmployeeDashboardView }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router