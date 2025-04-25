import express from 'express';
import gpuController from '../../controllers/gpu.controller.js';
import upload from '../../middlewares/uploadDynamic.js';

const router = express.Router();
const gpuUpload = upload('gpus');

router.get('/', gpuController.getGpus);
router.post('/', gpuUpload.single('image'), gpuController.createGpu);
router.put('/:id', gpuUpload.single('image'), gpuController.updateGpu);
router.delete('/:id', gpuController.deleteGpu);

export default router;
