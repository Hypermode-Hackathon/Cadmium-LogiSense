import { openDB } from '../config/sqlite'

export const LoggedInOrganizationModel = {
  // Delete all rows and create a new entry
  setLoggedin: (id: string, cd_id: string, cd_secret: string, organization_name: string) => {
    const db = openDB()

    // Start a transaction
    const deleteStmt = db.prepare(`
            DELETE FROM loggedin_organization_detail
        `)
    const insertStmt = db.prepare(`
            INSERT INTO loggedin_organization_detail (id, cd_id, cd_secret, organization_name)
            VALUES (?, ?, ?, ?)
        `)

    try {
      const transaction = db.transaction(() => {
        deleteStmt.run() // Delete all rows (no parameters needed)
        insertStmt.run(id, cd_id, cd_secret, organization_name) // Insert the new row
      })
      transaction() // Execute the transaction
      return { success: true }
    } catch (error) {
      console.error('Error replacing logged-in organization:', error)
      throw error
    }
  }
}
