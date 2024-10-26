// repositories/service.repository.ts
import { Service, IService } from '../models/service.model';
import { CreateServiceDTO, UpdateServiceDTO } from '../dtos/service.dto';

class ServiceRepository {
  async createService(data: CreateServiceDTO): Promise<IService> {
    const service = new Service(data);
    return await service.save();
  }

  async getAllServices(orgId: string): Promise<IService[]> {
    return await Service.find({ organizationId: orgId });  // Filter by organization ID
  }

  async getServiceById(id: string, orgId: string): Promise<IService | null> {
    return await Service.findOne({ _id: id, organizationId: orgId }); // Ensure service belongs to the org
  }

  async updateService(id: string, updateData: UpdateServiceDTO, orgId: string): Promise<IService | null> {
    return await Service.findOneAndUpdate(
      { _id: id, organizationId: orgId },  // Ensure it belongs to the org
      updateData,
      { new: true }
    );
  }

  async deleteService(id: string, orgId: string): Promise<IService | null> {
    return await Service.findOneAndDelete({ _id: id, organizationId: orgId }); // Ensure it belongs to the org
  }
}

export const serviceRepository = new ServiceRepository();
