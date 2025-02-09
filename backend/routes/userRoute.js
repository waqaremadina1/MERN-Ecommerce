import express from 'express'
import { 
    loginUser, 
    registerUser, 
    adminLogin, 
    getUserProfile,
    updateProfile,
    requestEmailVerification,
    verifyAndUpdateEmail,
    requestPasswordReset,
    resetPassword
} from '../controllers/userController.js'
import { requireAuth } from '../middleware/requireAuth.js'

const router = express.Router()

// Auth routes
router.post('/login', loginUser)
router.post('/register', registerUser)
router.post('/admin-login', adminLogin)

// Profile management (requires authentication)
router.get('/profile', requireAuth, getUserProfile)
router.put('/profile', requireAuth, updateProfile)
router.post('/request-email-verification', requireAuth, requestEmailVerification)
router.post('/verify-email', requireAuth, verifyAndUpdateEmail)

// Password reset (no auth required)
router.post('/forgot-password', requestPasswordReset)
router.post('/reset-password', resetPassword)

export default router