import * as fs from 'fs'
import * as path from 'path'

/**
 * Function to check if a folder with the given ID exists in the target-codebases directory.
 * @param id - The ID to check for.
 * @returns {boolean} - True if the folder exists, otherwise false.
 */
export function doesFolderExist(id: string): boolean {
  // Resolve the project path based on the given ID
  const PROJECT_PATH = path.resolve(__dirname, `./target-codebases/${id}`)

  try {
    // Check if the path exists and is a directory
    return fs.existsSync(PROJECT_PATH) && fs.lstatSync(PROJECT_PATH).isDirectory()
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Error checking folder existence: ${error.message}`)
    } else {
      console.error('Unknown error occurred while checking folder existence')
    }
    return false
  }
}
