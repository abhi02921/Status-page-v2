// routes/incident.routes.ts
import { Router } from 'express';
import { incidentController } from '../controllers/incident.controller';
import { asyncHandler } from '../utils/async.handler.util';

const router = Router();

router.post('/incidents', asyncHandler(incidentController.createIncident));
router.get('/incidents', asyncHandler(incidentController.getAllIncidents));
router.get('/incidents/:id', asyncHandler(incidentController.getIncidentById));
router.put('/incidents/:id', asyncHandler(incidentController.updateIncident));
router.delete('/incidents/:id', asyncHandler(incidentController.deleteIncident));

export default router;
