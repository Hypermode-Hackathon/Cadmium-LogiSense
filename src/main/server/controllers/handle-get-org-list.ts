// src/server/controllers/get-clients.ts

import { Organization } from '../../types/types'
import { Request, Response } from 'express'
import { OrganizationModel } from '../models/organizationModel'

// Controller to handle fetching clients
const handleGetOrgList = async (_req: Request, res: Response): Promise<void> => {
  try {
    const clients: Organization[] = OrganizationModel.getAllOrganizations()
    console.log('Organization List===>> ', clients)
    // Respond with the list of clients
    res.status(200).json({ clients })
  } catch (error: any) {
    console.error('[Error] =====>>', error)

    // Handle database errors
    res.status(500).json({
      error: 'Failed to retrieve clients.',
      details: error.message || 'An unexpected error occurred.'
    })
  }
}

export default handleGetOrgList
