import express from 'express';
import ramController from '../../controllers/ram.controller.js';
import upload from '../../middlewares/uploadDynamic.js';

const router = express.Router();
const ramUpload = upload('rams');

router.get('/', ramController.getRams);
router.post('/', ramUpload.single('image'), ramController.createRam);
router.put('/:id', ramUpload.single('image'), ramController.updateRam);
router.delete('/:id', ramController.deleteRam);

export default router;
