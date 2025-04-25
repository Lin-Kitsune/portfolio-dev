import express from 'express';
import diskController from '../../controllers/disk.controller.js';
import upload from '../../middlewares/uploadDynamic.js';

const router = express.Router();
const diskUpload = upload('disks');

router.get('/', diskController.getDisks);
router.post('/', diskUpload.single('image'), diskController.createDisk);
router.put('/:id', diskUpload.single('image'), diskController.updateDisk);
router.delete('/:id', diskController.deleteDisk);

export default router;
