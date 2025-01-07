import { openDB } from '../config/sqlite'
import { Request, Response } from 'express'
import { ProjectModel } from '../models/projectModel'
import path from 'path'
import fs from 'fs'
import { FolderChecker } from '../utils/check-folder-exists'

// Controller to handle fetching clients
const handleCheckProjectRemoteLink = async (req: Request, res: Response): Promise<void> => {
  console.log('*************')
  console.log('*************')
  console.log('req.body ===>>', req.body, '\n\n\n\n')
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

    console.log('*************all check pass ************** \n\n\n\n')
    const newList = list.map((item: any) => {
      if (!item.id) {
        return {
          ...item,
          remoteUrl: '',
          isConnectedToRemote: false
        }
      }
      console.log('*************')
      console.log('*************')
      console.log('************* loop first iteration ************** \n\n\n\n')
      console.log('item ===>>', item.id)
      const projectDetail = ProjectModel.getProjectById(item.id)
      console.log('#############')
      console.log('#############')
      console.log('projectDetail ===>>', projectDetail, '\n\n\n\n')
      console.log('#############')
      console.log('#############')
      console.log('************* check project exixts ************** \n\n\n\n')
      console.log('doesFolderExist(item.id) ===>>', item.id, FolderChecker.doesFolderExist(item.id))
      // Check if the project exists in the database
      if (projectDetail && FolderChecker.doesFolderExist(item.id)) {
        if (FolderChecker.doesFolderWithinFolderExist(item.id)) {
          ProjectModel.updateProjectById(item.id, item.name, item.description, 1)
          return {
            ...item,
            remoteUrl: projectDetail.remote_url,
            isConnectedToRemote: true
          }
        } else {
          ProjectModel.updateProjectById(item.id, item.name, item.description, 0)
          return {
            ...item,
            remoteUrl: projectDetail.remote_url,
            isConnectedToRemote: false
          }
        }
      } else {
        console.log('************* **************')
        console.log('************* **************')
        console.log('************* **************')
        console.log('************* create new project ************** \n\n\n\n')
        // Create a new project if it doesn't exist
        const { name, description, id } = item
        ProjectModel.createProject(name, description, id, organization_id)
        const PROJECT_PATH = path.resolve(__dirname, `../../target-codebases/${id}`)
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
    console.error('[Error] =====>>')
    console.error('[Error] =====>>')
    console.error('[Error] =====>>', error)

    // Handle database errors
    res.status(500).json({
      error: 'Failed to retrieve clients.',
      details: error.message || 'An unexpected error occurred.'
    })
  }
}

export default handleCheckProjectRemoteLink
