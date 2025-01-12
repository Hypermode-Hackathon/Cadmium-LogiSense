import { useAuthStore } from '../../stores/useAuthStore'
import { NavigateFunction } from 'react-router-dom'
import { useOpenProjectInfo } from '../../stores/useOpenProjectInfo'
import { useLogStore } from '../../stores/useLogStore'
import { toast } from '../../hooks/use-toast'
import { LOCAL_AXIOS_INSTANCE } from '../../axios/axios'

/**
 * Logs the user out of the application by clearing the local storage
 * and setting the authentication state to false. Then redirects
 * the user to the login page.
 *
 * @param navigate - The navigate function from react-router-dom.
 */
export const handleLogout = async (navigate: NavigateFunction) => {
  const { setIsLoggedIn, setOrganizationName } = useAuthStore.getState() // Zustand state for auth
  const { setProjectId, setOrganizationId, setProjectName, setProjectDescription } =
    useOpenProjectInfo.getState()
  const { resetTableData } = useLogStore.getState()
  const cd_id = localStorage.getItem('cd_id') ?? ''
  const cd_secret = localStorage.getItem('cd_secret') ?? ''

  try {
    await LOCAL_AXIOS_INSTANCE.post(
      '/logout',
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          'CD-ID': cd_id,
          'CD-Secret': cd_secret
        }
      }
    )
    // Clear the local storage
    localStorage.clear()

    // Clear auth state

    setIsLoggedIn(false)
    setOrganizationName('')

    // Clear open project state
    setProjectId(null)
    setOrganizationId(null)
    setProjectName(null)
    setProjectDescription(null)

    // Clear the log data
    resetTableData()

    // Redirect the user to the login page
    navigate('/login', { replace: true })
    toast({
      title: 'Success',
      description: 'Logged out successfully.'
    })
  } catch (error: Error | any) {
    console.log(error)
    // Display appropriate error messages
    if (error.response?.status === 401) {
      toast({
        title: 'Unauthorized',
        description: 'Invalid client ID or secret.'
      })
    } else if (error.response?.status === 400) {
      toast({
        title: 'Client error',
        description: 'Credentials already exist. Select an organization from the list.'
      })
    } else {
      toast({
        title: 'Error',
        description: error.message || 'Unknown error occurred.'
      })
    }
  }
}
