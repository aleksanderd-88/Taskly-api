import { Router } from 'express'
import controllers from '../controllers'
import verifyAuthToken from '../middleware/verifyAuthToken'

const router = Router()

router.get('/api/health-check', controllers.healthCheck)

// User
router.post('/api/users/create', controllers.user.create)
router.post('/api/users/auth', controllers.user.auth)
router.patch('/api/users/get', verifyAuthToken, controllers.user.get)
router.post('/api/users/resend-otp', controllers.user.resendOtp)

// Project
router.post('/api/projects/create', verifyAuthToken, controllers.project.create)
router.patch('/api/projects/list', verifyAuthToken, controllers.project.list)
router.get('/api/projects/:id/get', verifyAuthToken, controllers.project.get)
router.patch('/api/projects/:id/update', verifyAuthToken, controllers.project.update)
router.delete('/api/projects/:id/soft-delete', verifyAuthToken, controllers.project.softDelete)
router.patch('/api/projects/undo-delete', verifyAuthToken, controllers.project.undoDelete)
router.patch('/api/projects/hard-delete', verifyAuthToken, controllers.project.hardDelete)
router.patch('/api/projects/invitation/verify-token', controllers.project.verifyInvitationToken)
router.patch('/api/projects/invitation/verify-member', controllers.project.verifyMember)

// Task
router.post('/api/tasks/create', verifyAuthToken, controllers.task.create)
router.patch('/api/tasks/list', verifyAuthToken, controllers.task.list)
router.get('/api/tasks/:id/get', verifyAuthToken, controllers.task.get)
router.patch('/api/tasks/:id/update', verifyAuthToken, controllers.task.update)
router.delete('/api/tasks/:id/delete', verifyAuthToken, controllers.task._delete)

export default router