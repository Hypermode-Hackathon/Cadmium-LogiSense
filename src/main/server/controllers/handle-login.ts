import { CLOUD_AXIOS_INSTANCE } from '../config/axios'
import { Request, Response } from 'express'
import { OrganizationModel } from '../models/organizationModel'
import { LoggedInOrganizationModel } from '../models/loggedInOrganizationModel'

const handleLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    // Parse the incoming request body
    const body = req.body
    // console.log("Request Body:", body);

    if (!body.clientId || !body.clientSecret) {
      res.status(400).json({ error: 'Client ID and Client Secret are required.' })
      return // Ensure no further execution
    }

    // Fetch data from the external API
    const resp = await CLOUD_AXIOS_INSTANCE.get('/organizations', {
      headers: {
        'Content-Type': 'application/json',
        'CD-ID': body.clientId,
        'CD-Secret': body.clientSecret
      }
    })
    const { id: organization_id, org_name: organization_name } = resp.data

    // TODO:
    //! 1. Check if credentials are valid
    //! 2. Update the loggedin client to db for ai to access the logged in client cd_is and and cd_secret
    //! 3. Turn on the AI service
    //! 4. If credentials are valid and organization does not exist, create it

    // ! 1
    if (!organization_id || !organization_name) {
      res.status(400).json({ error: 'Invalid credentials.' })
      return
    }

    // ! 2
    LoggedInOrganizationModel.setLoggedin(
      organization_id,
      body.clientId,
      body.clientSecret,
      organization_name
    )

    // ! 3
    const foundOrg = OrganizationModel.getOrganizationByCdIdAndCdSecret(
      body.clientId,
      body.clientSecret
    )
    // Open the SQLite database and insert the client credentials
    console.log('foundOrg ===>>', foundOrg)
    if (foundOrg) {
      res.status(200).json({
        clientId: body.clientId,
        clientSecret: body.clientSecret,
        organization_name: foundOrg.organization_name,
        organization_id: foundOrg.id
      })
      return
    } else {
      OrganizationModel.createOrganization(
        organization_id,
        body.clientId,
        body.clientSecret,
        organization_name
      )
      res.status(200).json({
        clientId: body.clientId,
        clientSecret: body.clientSecret,
        organization_name: organization_name,
        organization_id: organization_id
      })
    }
  } catch (error: any) {
    console.error('[Error] =====>>', error)
    // Distinguish between axios and internal errors
    if (error.response && error.response.status) {
      res.status(error.response.status).json({
        error: error.response.data?.error || 'External API Error'
      })
      return
    }

    // Default to a 500 Internal Server Error for other cases
    res.status(500).json({
      error: error.message || 'An unexpected error occurred.'
    })
  }
}

export default handleLogin
