import express from 'express';
import fanController from '../../controllers/fan.controller.js';
import upload from '../../middlewares/uploadDynamic.js';

const router = express.Router();
const fanUpload = upload('fans');

router.get('/', fanController.getFans);
router.post('/', fanUpload.single('image'), fanController.createFan);
router.put('/:id', fanUpload.single('image'), fanController.updateFan);
router.delete('/:id', fanController.deleteFan);

export default router;
