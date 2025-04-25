import express from 'express';
import coolerController from '../../controllers/cooler.controller.js';
import upload from '../../middlewares/uploadDynamic.js';

const router = express.Router();
const coolerUpload = upload('coolers');

router.get('/', coolerController.getCoolers);
router.post('/', coolerUpload.single('image'), coolerController.createCooler);
router.put('/:id', coolerUpload.single('image'), coolerController.updateCooler);
router.delete('/:id', coolerController.deleteCooler);

export default router;
