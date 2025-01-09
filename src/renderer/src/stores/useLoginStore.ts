import { LoginState } from '../types/type'
import { create } from 'zustand'

export const useLoginStore = create<LoginState>((set) => ({
  formData: {
    clientId: '',
    clientSecret: ''
  },
  errors: {},
  loading: false,
  setFormData: (field, value) =>
    set((state) => ({
      formData: {
        ...state.formData,
        [field]: value
      }
    })),
  setErrors: (errors) =>
    set(() => ({
      errors
    })),
  setLoading: (loading) =>
    set(() => ({
      loading
    })),
  clearErrors: (field) =>
    set((state) => ({
      errors: {
        ...state.errors,
        [field]: undefined
      }
    }))
}))
