import express from 'express';
import psuController from '../../controllers/psu.controller.js';
import upload from '../../middlewares/uploadDynamic.js';

const router = express.Router();
const psuUpload = upload('psus');

router.get('/', psuController.getPsus);
router.post('/', psuUpload.single('image'), psuController.createPsu);
router.put('/:id', psuUpload.single('image'), psuController.updatePsu);
router.delete('/:id', psuController.deletePsu);

export default router;
