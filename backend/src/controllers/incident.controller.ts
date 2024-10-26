import { Request, Response } from 'express';
import { incidentService } from '../services/incident.service';
import { successResponse, errorResponse } from '../utils/response.util';
import { getAuth } from '@clerk/express';
import { CreateIncidentDTO, UpdateIncidentDTO } from '../dtos/incident.dto'; // Assuming you have these DTOs

class IncidentController {
    // Create an incident
    async createIncident(req: Request, res: Response) {
        try {
            const user = getAuth(req); // Assuming you're using Clerk or similar for auth
            const organizationId = user.orgId; // Getting organization ID from the authenticated user

            if (!organizationId) {
                return errorResponse(res, 'Organization not found', 404);
            }

            const data: CreateIncidentDTO = {
                ...req.body,
                organizationId, // Binding the incident to the organization
            };

            const incident = await incidentService.createIncident(data);

            // Emit the new incident via WebSocket to all connected clients
            req.io.emit('incident', { action: 'create', incident });

            return successResponse(res, 'Incident created successfully', incident);
        } catch (error) {
            if (error instanceof Error) {
                return errorResponse(res, error.message);
            }
            return errorResponse(res, 'An unknown error occurred');
        }
    }

    // Get an incident by ID
    async getIncidentById(req: Request, res: Response) {
        try {
            const user = getAuth(req);
            const organizationId = user.orgId;

            if (!organizationId) {
                return errorResponse(res, 'Organization not found', 404);
            }

            const { id } = req.params;
            const incident = await incidentService.getIncidentById(id, organizationId);

            if (!incident) {
                return errorResponse(res, 'Incident not found', 404);
            }

            return successResponse(res, 'Incident retrieved successfully', incident);
        } catch (error) {
            if (error instanceof Error) {
                return errorResponse(res, error.message);
            }
            return errorResponse(res, 'An unknown error occurred');
        }
    }

    // Get all incidents for the organization
    async getAllIncidents(req: Request, res: Response) {
        try {
            const user = getAuth(req);
            const organizationId = user.orgId;

            if (!organizationId) {
                return errorResponse(res, 'Organization not found', 404);
            }

            const incidents = await incidentService.getAllIncidents(organizationId);

            return successResponse(res, 'Incidents retrieved successfully', incidents);
        } catch (error) {
            if (error instanceof Error) {
                return errorResponse(res, error.message);
            }
            return errorResponse(res, 'An unknown error occurred');
        }
    }

    // Update an incident
    async updateIncident(req: Request, res: Response) {
        try {
            const user = getAuth(req);
            const organizationId = user.orgId;

            if (!organizationId) {
                return errorResponse(res, 'Organization not found', 404);
            }

            const { id } = req.params;
            const data: UpdateIncidentDTO = req.body;

            const updatedIncident = await incidentService.updateIncident(id, data, organizationId);

            if (!updatedIncident) {
                return errorResponse(res, 'Incident not found', 404);
            }

            // Emit the updated incident via WebSocket to all connected clients
            req.io.emit('incident', { action: 'update', incident: updatedIncident });

            return successResponse(res, 'Incident updated successfully', updatedIncident);
        } catch (error) {
            if (error instanceof Error) {
                return errorResponse(res, error.message);
            }
            return errorResponse(res, 'An unknown error occurred');
        }
    }

    // Delete an incident
    async deleteIncident(req: Request, res: Response) {
        try {
            const user = getAuth(req);
            const organizationId = user.orgId;

            if (!organizationId) {
                return errorResponse(res, 'Organization not found', 404);
            }

            const { id } = req.params;
            const deletedIncident = await incidentService.deleteIncident(id, organizationId);

            if (!deletedIncident) {
                return errorResponse(res, 'Incident not found', 404);
            }

            // Emit the deleted incident via WebSocket to all connected clients
            req.io.emit('incident', { action: 'delete', incidentId: id });

            return successResponse(res, 'Incident deleted successfully', deletedIncident);
        } catch (error) {
            if (error instanceof Error) {
                return errorResponse(res, error.message);
            }
            return errorResponse(res, 'An unknown error occurred');
        }
    }
}

export const incidentController = new IncidentController();
