import { openDB } from '../config/sqlite'
import { Request, Response } from 'express'
import { ProjectModel } from '../models/projectModel'
import path from 'path'
import fs from 'fs'
import { doesFolderExist } from '../utils/check-path-exists'
import { console } from 'inspector'

// Controller to handle fetching clients
const handleCheckProjectRemoteLink = async (req: Request, res: Response): Promise<void> => {
  try {
    // Open the SQLite database
    const list = req.body.projectList as any[]
    const organization_id = req.body.organization_id
    openDB()

    if (!organization_id) {
      res.status(400).json({ error: 'organization_id is required.' })
      return
    }

    if (!list || list.length === 0) {
      res.status(400).json({ error: 'Need to create project first' })
      return
    }
    const newList = list.map((item: any) => {
      if (!item.id) {
        return {
          ...item,
          remoteUrl: '',
          isConnectedToRemote: false
        }
      }
      console.log('item ===>>', item.id)
      const projectDetail = ProjectModel.getProjectById(item.id)

      // Check if the project exists in the database
      if (projectDetail && doesFolderExist(item.id)) {
        // Update the project details in the database if it was updated by other user
        ProjectModel.updateProjectById(item.id, item.name, item.description)
        return {
          ...item,
          remoteUrl: projectDetail.remote_url,
          isConnectedToRemote: projectDetail.is_connected_to_remote
        }
      } else {
        // Create a new project if it doesn't exist
        const { name, description, id } = item
        ProjectModel.createProject(name, description, id, organization_id)
        const PROJECT_PATH = path.resolve(__dirname, `./target-codebases/${id}`)
        if (!fs.existsSync(PROJECT_PATH)) {
          fs.mkdirSync(PROJECT_PATH, { recursive: true })
        }
        return {
          ...item,
          remoteUrl: '',
          isConnectedToRemote: false
        }
      }
    })

    res.status(200).json({ list: newList })
  } catch (error: any) {
    console.error('[Error] =====>>', error)

    // Handle database errors
    res.status(500).json({
      error: 'Failed to retrieve clients.',
      details: error.message || 'An unexpected error occurred.'
    })
  }
}

export default handleCheckProjectRemoteLink
