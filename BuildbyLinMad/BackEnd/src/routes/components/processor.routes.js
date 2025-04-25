import express from 'express';
import processorController from '../../controllers/processor.controller.js';
import upload from '../../middlewares/uploadDynamic.js';

const router = express.Router();
const processorUpload = upload('processors');

router.get('/', processorController.getProcessors);
router.post('/', processorUpload.single('image'), processorController.createProcessor);
router.put('/:id', processorUpload.single('image'), processorController.updateProcessor);
router.delete('/:id', processorController.deleteProcessor);

export default router;
