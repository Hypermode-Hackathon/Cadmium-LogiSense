import { useAuthStore } from '../../stores/useAuthStore'
import { NavigateFunction } from 'react-router-dom'
import { useOpenProjectInfo } from '../../stores/useOpenProjectInfo'
import { useLogStore } from '../../stores/useLogStore'

/**
 * Logs the user out of the application by clearing the local storage
 * and setting the authentication state to false. Then redirects
 * the user to the login page.
 *
 * @param navigate - The navigate function from react-router-dom.
 */
export const handleLogout = (navigate: NavigateFunction) => {
  // Clear the local storage
  localStorage.clear()

  // Clear auth state
  const { setIsLoggedIn, setOrganization } = useAuthStore.getState() // Zustand state for auth
  setIsLoggedIn(false)
  setOrganization('')

  // Clear the project information
  const { setProjectId, setOrganizationId, setProjectName, setProjectDescription } =
    useOpenProjectInfo.getState()
  setProjectId(null)
  setOrganizationId(null)
  setProjectName(null)
  setProjectDescription(null)

  // Clear the log data
  const { resetTableData } = useLogStore.getState()
  resetTableData()

  // TODO: 1 turn off the AI

  // Redirect the user to the login page
  navigate('/login', { replace: true })
}
