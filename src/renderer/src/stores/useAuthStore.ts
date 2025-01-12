import { create } from 'zustand'

interface AuthState {
  isLoggedIn: boolean
  setIsLoggedIn: (status: boolean) => void
  organizationName: string
  setOrganizationName: (org: string) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  setIsLoggedIn: (status) => set({ isLoggedIn: status }),
  organizationName: '',
  setOrganizationName: (org) => set({ organizationName: org })
}))
