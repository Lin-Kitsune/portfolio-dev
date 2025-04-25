import express from 'express';
import motherboardController from '../../controllers/motherboard.controller.js';
import upload from '../../middlewares/uploadDynamic.js';

const router = express.Router();
const motherboardUpload = upload('motherboards');

router.get('/', motherboardController.getMotherboards);
router.post('/', motherboardUpload.single('image'), motherboardController.createMotherboard);
router.put('/:id', motherboardUpload.single('image'), motherboardController.updateMotherboard);
router.delete('/:id', motherboardController.deleteMotherboard);

export default router;
