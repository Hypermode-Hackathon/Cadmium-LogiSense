import React from 'react'
import { useQuery } from '@tanstack/react-query'
import Header from './header'
import { useParams } from 'react-router-dom'
import NotFound from '../../../pages/not-found/not-found'
import Analyze from './analyze'
import Configure from './configure'
import Explorer from './explorer'
import { useAuthStore } from '../../../../../renderer/src/stores/useAuthStore'
import { fetchOpenProjectInfo } from '../../../../../renderer/src/services/api/fetch-open-project-info'

type Submodule = 'explorer' | 'analyze' | 'configure'

const LogAnalysis: React.FC = () => {
  const { submodule, project_id } = useParams<{
    submodule: Submodule
    project_id: string
  }>() // Treat as a string to handle unmatched cases

  const { organization } = useAuthStore()

  // Fetch project info to store the general info of opened project
  useQuery({
    queryKey: [organization, project_id],
    queryFn: () => (project_id ? fetchOpenProjectInfo({ project_id }) : {}),
    refetchOnWindowFocus: false
  })

  let content

  switch (submodule) {
    case 'explorer':
      content = <Explorer />
      break
    case 'analyze':
      content = <Analyze />
      break
    case 'configure':
      content = <Configure />
      break
    default:
      content = <NotFound /> // Default case for unmatched submodules
      break
  }

  return (
    <div className="flex flex-col mb-[5vh] w-full">
      <Header />
      {content}
    </div>
  )
}

export default LogAnalysis
