import { Router } from 'express';
import { serviceController } from '../controllers/service.controller';
import { asyncHandler } from '../utils/async.handler.util';

const router = Router();

router.post('/services', asyncHandler(serviceController.createService));
router.get('/services', asyncHandler(serviceController.getAllServices));
router.get('/services/:id', asyncHandler(serviceController.getServiceById));
router.put('/services/:id', asyncHandler(serviceController.updateService));
router.delete('/services/:id', asyncHandler(serviceController.deleteService));

export default router;
