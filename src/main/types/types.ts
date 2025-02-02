// src/preload/types.ts
export type IPCChannels = 'toMain' | 'fromMain'

export interface ToMainPayload {
  message: string
}

export interface FromMainPayload {
  response: string
}

// ** ORGANIZATION TYPE **
export interface Organization {
  id: string
  cd_id: string
  cd_secret: string
  created_at: string
  organization_id: string
  organization_name: string
}

// ** PROJECT TYPE **
export interface Project {
  id: string
  name: string
  description: string
  project_id: string
  organization_id: string
  is_connected_to_remote: boolean
  remote_url: string
}

export type ProjectList = Project[]
