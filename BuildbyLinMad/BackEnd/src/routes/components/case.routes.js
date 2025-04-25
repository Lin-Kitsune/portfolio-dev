import express from 'express';
import caseCtrl from '../../controllers/case.controller.js';
import upload from '../../middlewares/uploadDynamic.js';

const router = express.Router();
const caseUpload = upload('cases');

router.get('/', caseCtrl.getCases);
router.post('/', caseUpload.single('image'), caseCtrl.createCase);
router.put('/:id', caseUpload.single('image'), caseCtrl.updateCase);
router.delete('/:id', caseCtrl.deleteCase);

export default router;
