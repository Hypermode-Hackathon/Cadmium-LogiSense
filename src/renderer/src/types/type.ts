// ****************************************************************************** //
//! ***************************** LOGIN TYPES *********************************** //
// ****************************************************************************** //
export interface LoginFormData {
  clientId: string
  clientSecret: string
}

export interface LoginFormErrors {
  clientId?: string
  clientSecret?: string
}

export interface LoginState {
  formData: LoginFormData
  errors: LoginFormErrors
  loading: boolean
  setFormData: (field: keyof LoginFormData, value: string) => void
  setErrors: (errors: LoginFormErrors) => void
  setLoading: (loading: boolean) => void
  clearErrors: (field: keyof LoginFormErrors) => void
}

// ****************************************************************************** //
//! ***************************** ORGANIZATION TYPES *********************************** //
// ****************************************************************************** //

export interface Organization {
  id: string
  cd_id: string
  cd_secret: string
  created_at: string
  organization_name: string
}

// ****************************************************************************** //
//! ***************************** PROJECTS LIST TYPES *********************************** //
// ****************************************************************************** //

export type ProjectCardData = {
  name: string
  value: number | string
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | null | undefined
}

export type ProjectCardProps = {
  id: string
  title: string
  description: string
  data: ProjectCardData[]
  isLinkedToRemote: boolean
  remoteUrl: string
  onOpenProject: () => void
  onOpenTerminal: () => void
}

export interface Project {
  id: string
  name: string
  description: string
  errorCount: number
  codeSuggestionCount: number
  totalErrorResolved: number
  isConnectedToRemote: boolean
  remoteUrl: string
}

export type ProjectList = Project[]

export interface CreateProjectState {
  name: string
  setName: (name: string) => void
  description: string
  setDescription: (description: string) => void
  loading: boolean
  setLoading: (loading: boolean) => void
  openModal: boolean
  setOpenModal: (openModal: boolean) => void
  errors: { name?: string; description?: string }
  setErrors: (errors: { name?: string; description?: string }) => void
}

export interface ProjectState {
  loading: boolean
  setLoading: (loading: boolean) => void
  projectList: ProjectList
  setProjectList: (projects: ProjectList) => void
}

export interface TerminalDrawerStoreState {
  loading: boolean
  setLoading: (loading: boolean) => void
  openDrawer: boolean
  setOpenDrawer: (openDrawer: boolean) => void
}

// ****************************************************************************** //
// ****************************************************************************** //
// ****************************************************************************** //
// ****************************************************************************** //
//! ********************* SELECTED/OPENED PROJECTS TYPES ************************ //
// ****************************************************************************** //
// ****************************************************************************** //
// ****************************************************************************** //
// ****************************************************************************** //

// ****************************************************************************** //
//! ********************* SELECTED/OPENED PROJECTS TYPES ************************ //
//! ************************** GENERAL INFO TYPES ******************************* //
// ****************************************************************************** //

export interface OpenProjectState {
  project_id: string | null
  setProjectId: (project_id: string | null) => void
  organization_id: string | null
  setOrganizationId: (organization_id: string | null) => void
  project_name: string | null
  setProjectName: (project_name: string | null) => void
  project_description: string | null
  setProjectDescription: (project_description: string | null) => void
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void
}

// ****************************************************************************** //
//! ********************* SELECTED/OPENED PROJECTS TYPES ************************ //
//! ***************************** LOGS TYPES *********************************** //
// ****************************************************************************** //

// Type for each formatted response in ragInference
export interface FormattedRagResponse {
  type: 'markdown' | 'code'
  value: string
}

// Type for rag_response object
export interface RagResponse {
  formatted_rag_response: FormattedRagResponse[]
  rag_response: {
    application_id: string
    created_at: string // ISO 8601 format
    processed_at: string // ISO 8601 format
    query: string
    rag_response: string
  }
  application_id: string
  created_at: string // ISO 8601 format
  query: string
}

// Type for Log Entry
export interface LogTableEntry {
  id: string
  organizationId: string
  applicationId: string
  error: string
  url: string
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'default'
  createdAt: string // ISO 8601 format
  updatedAt: string // ISO 8601 format
  ragInference: { rag_response: RagResponse | null } // Parsed JSON or null if parsing fails
  traceback: string
  isStreaming?: boolean
}

// Example: Array of log entries
export type LogData = LogTableEntry[]

export interface LogStoreState {
  loading: boolean
  setLoading: (loading: boolean) => void

  openSlideOver: boolean
  setOpenSlideOver: (openSlideOver: boolean) => void

  selectedLog: LogTableEntry | null
  setSelectedLog: (selectedLog: LogTableEntry) => void

  page: number
  setPage: (page: number) => void
  incrementPage: () => void
  decrementPage: () => void
  limit: number
  setLimit: (limit: number) => void
  totalLogs: number | null // Add this
  setTotalLogs: (totalLogs: number) => void // Add this

  tableData: LogTableEntry[]
  setTableData: (tableData: LogTableEntry[]) => void
  resetTableData: () => void

  appendTableDataToBottom: (newData: LogTableEntry[]) => void
  appendTableDataToTop: (newData: LogTableEntry[]) => void

  setLogDataToStream: (dataToStream: StreamResponse | null) => void
  streamingData: LogTableEntry | null
  setStreamingData: (streamingData: LogTableEntry | null) => void
}

export type StreamResponse = {
  isStreaming: boolean
  application_id: string
  chunk: string
  log_id: string
}
