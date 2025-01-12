// src/routes/routes.ts
import { Router } from 'express'
import handleLogin from '../controllers/handle-login'
import handleGetOrgList from '../controllers/handle-get-org-list'
import validateCredentials from '../controllers/handle-validate-user'
import handleCreateProject from '../controllers/handle-create-project'
import handleCheckProjectRemoteLink from '../controllers/handle-check-project-remote-link'
import validateHeadersMiddleware from '../middlewares/validation'
import handleLogout from '../controllers/handle-logout'

const router = Router()
// TEST API
router.post('/echo-request', (req, res) => {
  res.json({ result: req.body })
})

router.post('/login', handleLogin)
router.post('/validation', validateCredentials)
router.get('/org-list', handleGetOrgList)
router.post('/logout', validateHeadersMiddleware, handleLogout)
router.post('/project/check_remote_link', validateHeadersMiddleware, handleCheckProjectRemoteLink)
router.post('/project', validateHeadersMiddleware, handleCreateProject)

export default router
