import { Request, Response } from 'express'
import { openDB } from '../config/sqlite'

const handleLogout = async (req: Request, res: Response): Promise<void> => {
  // Extract CD-ID and CD-Secret headers
  const cdId = req.headers['cd-id'] as string | undefined
  const cdSecret = req.headers['cd-secret'] as string | undefined

  console.log('cdId ===>>', cdId)
  console.log('cdSecret ===>>', cdSecret)

  try {
    // Validate presence of headers
    if (!cdId || !cdSecret) {
      res.status(400).json({
        error: 'CD-ID and CD-Secret headers are required.'
      })
      return
    }
    const db = openDB()
    const deleteStmt = db.prepare(`
        DELETE FROM loggedin_organization_detail
    `)

    deleteStmt.run() // Execute the DELETE query to clear the table
    res.status(200).json({ message: 'Logout successful.' })
  } catch (error: any) {
    console.error('[Error] =====>>', error)
    // Default to a 500 Internal Server Error for other cases
    res.status(500).json({
      error: error.message || 'An unexpected error occurred.'
    })
  }
}

export default handleLogout
