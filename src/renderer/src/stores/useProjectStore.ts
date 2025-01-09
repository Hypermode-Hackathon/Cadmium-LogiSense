import { create } from 'zustand'
import { OpenProjectState } from '../types/type'

export const useOpenedProjectStore = create<OpenProjectState>((set) => ({
  project_id: null,
  setProjectId: (project_id: string) => set({ project_id }),
  project_name: null,
  setProjectName: (project_name: string) => set({ project_name }),
  project_description: null,
  setProjectDescription: (project_description: string) => set({ project_description })
}))
