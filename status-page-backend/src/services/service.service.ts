// services/service.service.ts
import { serviceRepository } from '../repositories/service.repository';
import { CreateServiceDTO, UpdateServiceDTO } from '../dtos/service.dto';

class ServiceService {
  async createService(data: CreateServiceDTO) {
    // Add additional business logic if needed
    return await serviceRepository.createService(data);
  }

  async getAllServices(orgId: string) {
    return await serviceRepository.getAllServices(orgId);  // Pass orgId
  }

  async getServiceById(id: string, orgId: string) {
    return await serviceRepository.getServiceById(id, orgId); // Pass orgId
  }

  async updateService(id: string, data: UpdateServiceDTO, orgId: string) {
    return await serviceRepository.updateService(id, data, orgId); // Pass orgId
  }

  async deleteService(id: string, orgId: string) {
    return await serviceRepository.deleteService(id, orgId); // Pass orgId
  }
}

export const serviceService = new ServiceService();
