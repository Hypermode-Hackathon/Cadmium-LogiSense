import { LOCAL_AXIOS_INSTANCE } from '../../axios/axios'
import { Card, CardContent, CardDescription, CardHeader } from '../../components/ui/card'
import Loader from '../../components/ui/loader'
import { toast } from '../../hooks/use-toast'
import { Organization } from '../../types/type'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { useLoginStore } from '../../stores/useLoginStore'
import { useNavigate } from 'react-router-dom'
import { handleLogin } from '../../services/api/handle-login'

const ChooseOrg: React.FC = () => {
  const { setFormData } = useLoginStore()
  const navigate = useNavigate()
  const getOrgList = async () => {
    try {
      const { data } = await LOCAL_AXIOS_INSTANCE.get('/org-list')
      return data.clients as Organization[]
    } catch (error: Error | any) {
      console.log(error)
      toast({ title: 'Server Error', description: "Could'nt fetch organization list." })
      return [] // Return an empty array in case of error
    }
  }
  const { isLoading, data } = useQuery({
    queryKey: ['org-list'],
    queryFn: () => getOrgList() as Promise<Organization[] | any>,
    refetchOnWindowFocus: false
  })

  const handleChooseOrg = async (org: Organization) => {
    setFormData('clientId', org.cd_id)
    setFormData('clientSecret', org.cd_secret)
    await handleLogin(navigate) // Call the extracted login handler
  }

  return (
    <Card className="mx-auto max-w-sm w-full">
      <CardHeader className="py-3">
        <CardDescription>Choose saved organization.</CardDescription>
      </CardHeader>
      {isLoading ? (
        <Loader size="6" color="accent" speed="slow" />
      ) : data?.length === 0 ? (
        <p className="text-center my-4">No saved organization found.</p>
      ) : (
        <CardContent className="">
          {data &&
            data?.map((org: Organization) => (
              <div className="mb-2" key={org.id}>
                <p
                  className="text-xl inline no-underline hover:underline cursor-pointer"
                  onClick={() => handleChooseOrg(org)}
                >
                  {org.organization_name}
                </p>
              </div>
            ))}
        </CardContent>
      )}
    </Card>
  )
}

export default ChooseOrg
