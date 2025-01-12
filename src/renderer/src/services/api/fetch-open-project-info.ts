import { CLOUD_AXIOS_INSTANCE } from '../../axios/axios'
import { useOpenProjectInfo } from '../../stores/useOpenProjectInfo'

export const fetchOpenProjectInfo = async ({ project_id }: { project_id: string }) => {
  const { setIsLoading, setProjectId, setProjectName, setOrganizationId } =
    useOpenProjectInfo.getState()
  const cd_id = localStorage.getItem('cd_id') ?? ''
  const cd_secret = localStorage.getItem('cd_secret') ?? ''
  try {
    setIsLoading(true)
    const response = await CLOUD_AXIOS_INSTANCE.get(`/applications/${project_id}`, {
      headers: {
        'Content-Type': 'application/json',
        'CD-ID': cd_id,
        'CD-Secret': cd_secret
      }
    })
    const projects = response.data
    setProjectId(projects._id.$oid)
    setProjectName(projects.application_name)
    setOrganizationId(projects.organization_id.$oid)

    return projects
  } catch (error) {
    console.error('Error fetching projects:', error)
  } finally {
    setIsLoading(false)
  }
}
