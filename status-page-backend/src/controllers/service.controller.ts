import { Request, Response } from 'express';
import { serviceService } from '../services/service.service';
import { CreateServiceDTO, UpdateServiceDTO } from '../dtos/service.dto';
import { successResponse, errorResponse } from '../utils/response.util';
import { getAuth } from '@clerk/express';

class ServiceController {
  async createService(req: Request, res: Response) {
    try {
      const user = getAuth(req);
      if (!user.orgId) {
        return errorResponse(res, 'Organization not found', 404);
      }
      const data: CreateServiceDTO = {
        ...req.body,
        organizationId: user.orgId, // Extracting orgId from authenticated user
      };
      const service = await serviceService.createService(data);
      return successResponse(res, 'Service created successfully', service);
    } catch (error) {
      if (error instanceof Error) {
        return errorResponse(res, error.message);
      }
      return errorResponse(res, 'An unknown error occurred');
    }
  }

  async getAllServices(req: Request, res: Response) {
    try {
      const user = getAuth(req);
      if (!user.orgId) {
        return errorResponse(res, 'Organization not found', 404);
      }
      const services = await serviceService.getAllServices(user.orgId); 
      return successResponse(res, 'Services retrieved successfully', services);
    } catch (error) {
      if (error instanceof Error) {
        return errorResponse(res, error.message);
      }
      return errorResponse(res, 'An unknown error occurred');
    }
  }

  async getServiceById(req: Request, res: Response) {
    try {
      const user = getAuth(req);
      if (!user.orgId) {
        return errorResponse(res, 'Organization not found', 404);
      }
      const service = await serviceService.getServiceById(req.params.id, user.orgId); // Pass orgId
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

  async updateService(req: Request, res: Response) {
    try {
      const user = getAuth(req);
      if (!user.orgId) {
        return errorResponse(res, 'Organization not found', 404);
      }
      const data: UpdateServiceDTO = req.body;
      const service = await serviceService.updateService(req.params.id, data, user.orgId); // Pass orgId
      if (!service) {
        return errorResponse(res, 'Service not found', 404);
      }
      return successResponse(res, 'Service updated successfully', service);
    } catch (error) {
      if (error instanceof Error) {
        return errorResponse(res, error.message);
      }
      return errorResponse(res, 'An unknown error occurred');
    }
  }

  async deleteService(req: Request, res: Response) {
    try {
      const user = getAuth(req);
      if (!user.orgId) {
        return errorResponse(res, 'Organization not found', 404);
      }
      const service = await serviceService.deleteService(req.params.id, user.orgId); // Pass orgId
      if (!service) {
        return errorResponse(res, 'Service not found', 404);
      }
      return successResponse(res, 'Service deleted successfully', service);
    } catch (error) {
      if (error instanceof Error) {
        return errorResponse(res, error.message);
      }
      return errorResponse(res, 'An unknown error occurred');
    }
  }
}

export const serviceController = new ServiceController();
