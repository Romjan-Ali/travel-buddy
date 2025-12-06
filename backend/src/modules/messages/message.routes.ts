import { Router } from 'express'
import { messageController } from './message.controller'
import { authenticate } from '../../middleware/auth'
import { validate } from '../../middleware/validation'

const router = Router()

router.use(authenticate)

router.post('/send', messageController.sendMessage)
router.get('/conversations', messageController.getConversations)
router.get('/conversation/:userId', messageController.getConversation)
router.post('/read', messageController.markAsRead)
router.delete('/:id', messageController.deleteMessage)

export default router