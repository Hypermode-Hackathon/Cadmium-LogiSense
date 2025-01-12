import { create } from 'zustand'
import { OpenProjectState } from '../types/type'

export const useOpenProjectInfo = create<OpenProjectState>((set) => ({
  project_id: null,
  setProjectId: (project_id) => set({ project_id }),
  organization_id: null,
  setOrganizationId: (organization_id) => set({ organization_id }),
  project_name: null,
  setProjectName: (project_name) => set({ project_name }),
  project_description: null,
  setProjectDescription: (project_description) => set({ project_description }),
  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading })
}))
