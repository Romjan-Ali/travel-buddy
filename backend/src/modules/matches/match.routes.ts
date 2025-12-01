import { Router } from 'express';
import { matchController } from './match.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();

router.post('/', authenticate, matchController.createMatch);
router.get('/', authenticate, matchController.getUserMatches);
router.get('/suggestions', authenticate, matchController.getMatchSuggestions);
router.patch('/:id/status', authenticate, matchController.updateMatchStatus);
router.delete('/:id', authenticate, matchController.deleteMatch);

export default router;