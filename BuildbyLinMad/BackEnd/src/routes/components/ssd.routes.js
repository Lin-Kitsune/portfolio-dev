import express from 'express';
import ssdController from '../../controllers/ssd.controller.js';
import upload from '../../middlewares/uploadDynamic.js';

const router = express.Router();
const ssdUpload = upload('ssds');

router.get('/', ssdController.getSsds);
router.post('/', ssdUpload.single('image'), ssdController.createSsd);
router.put('/:id', ssdUpload.single('image'), ssdController.updateSsd);
router.delete('/:id', ssdController.deleteSsd);

export default router;
