import { Request, Response } from 'express';
import { serviceService } from '../services/service.service';
import { CreateServiceDTO, UpdateServiceDTO } from '../dtos/service.dto';
import { successResponse, errorResponse } from '../utils/response.util';
import { getAuth } from '@clerk/express';

class ServiceController {
  // Create a service
  async createService(req: Request, res: Response) {
    try {
      const user = getAuth(req);
      const organizationId = user.orgId; // Getting organization ID from the authenticated user

      if (!organizationId) {
        return errorResponse(res, 'Organization not found', 404);
      }

      const data: CreateServiceDTO = {
        ...req.body,
        organizationId, // Binding the service to the organization
      };

      const service = await serviceService.createService(data);

      // Emit the new service via WebSocket to all connected clients
      req.io.emit('service', { action: 'create', service });

      return successResponse(res, 'Service created successfully', service);
    } catch (error) {
      if (error instanceof Error) {
        return errorResponse(res, error.message);
      }
      return errorResponse(res, 'An unknown error occurred');
    }
  }

  // Get a service by ID
  async getServiceById(req: Request, res: Response) {
    try {
      const user = getAuth(req);
      const organizationId = user.orgId;

      if (!organizationId) {
        return errorResponse(res, 'Organization not found', 404);
      }

      const { id } = req.params;
      const service = await serviceService.getServiceById(id, organizationId);

      if (!service) {
        return errorResponse(res, 'Service not found', 404);
      }

      return successResponse(res, 'Service retrieved successfully', service);
    } catch (error) {
      if (error instanceof Error) {
        return errorResponse(res, error.message);
      }
      return errorResponse(res, 'An unknown error occurred');
    }
  }

  // Get all services for the organization
  async getAllServices(req: Request, res: Response) {
    try {
      const user = getAuth(req);
      const organizationId = user.orgId;

      if (!organizationId) {
        return errorResponse(res, 'Organization not found', 404);
      }

      const services = await serviceService.getAllServices(organizationId);

      return successResponse(res, 'Services retrieved successfully', services);
    } catch (error) {
      if (error instanceof Error) {
        return errorResponse(res, error.message);
      }
      return errorResponse(res, 'An unknown error occurred');
    }
  }

  // Update a service
  async updateService(req: Request, res: Response) {
    try {
      const user = getAuth(req);
      const organizationId = user.orgId;

      if (!organizationId) {
        return errorResponse(res, 'Organization not found', 404);
      }

      const { id } = req.params;
      const data: UpdateServiceDTO = req.body;

      const updatedService = await serviceService.updateService(id, data, organizationId);

      if (!updatedService) {
        return errorResponse(res, 'Service not found', 404);
      }

      // Emit the updated service via WebSocket to all connected clients
      req.io.emit('service', { action: 'update', service: updatedService });

      return successResponse(res, 'Service updated successfully', updatedService);
    } catch (error) {
      if (error instanceof Error) {
        return errorResponse(res, error.message);
      }
      return errorResponse(res, 'An unknown error occurred');
    }
  }

  // Delete a service
  async deleteService(req: Request, res: Response) {
    try {
      const user = getAuth(req);
      const organizationId = user.orgId;

      if (!organizationId) {
        return errorResponse(res, 'Organization not found', 404);
      }

      const { id } = req.params;
      const deletedService = await serviceService.deleteService(id, organizationId);

      if (!deletedService) {
        return errorResponse(res, 'Service not found', 404);
      }

      // Emit the deleted service via WebSocket to all connected clients
      req.io.emit('service', { action: 'delete', serviceId: id });

      return successResponse(res, 'Service deleted successfully', deletedService);
    } catch (error) {
      if (error instanceof Error) {
        return errorResponse(res, error.message);
      }
      return errorResponse(res, 'An unknown error occurred');
    }
  }
}

export const serviceController = new ServiceController();
