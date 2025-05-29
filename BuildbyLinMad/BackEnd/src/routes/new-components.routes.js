import express from 'express';
import { getNewComponents } from '../controllers/newComponents.controller.js';

const router = express.Router();

router.get('/', getNewComponents);

export default router;
