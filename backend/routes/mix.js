import express from 'express';
import { generatePlaylist, getPlaylist, getAllPlaylists } from '../controllers/mixController.js';

const router = express.Router();

router.post('/generate', generatePlaylist);
router.get('/all', getAllPlaylists);
router.get('/:id', getPlaylist);

export default router;
