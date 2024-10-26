import { incidentRepository } from '../repositories/incident.repository';
import { CreateIncidentDTO, UpdateIncidentDTO } from '../dtos/incident.dto';

class IncidentService {
    async createIncident(data: CreateIncidentDTO) {
      return await incidentRepository.createIncident(data); // Adjust to handle orgId and service ID
    }
  
    async getIncidentById(id: string, organizationId: string) {
      return await incidentRepository.getIncidentById(id, organizationId); // Check orgId
    }
  
    async getAllIncidents(organizationId: string) {
      return await incidentRepository.getAllIncidents(organizationId); // Filter by orgId
    }
  
    async updateIncident(id: string, data: UpdateIncidentDTO, organizationId: string) {
      return await incidentRepository.updateIncident(id, data, organizationId); // Check orgId
    }
  
    async deleteIncident(id: string, organizationId: string) {
      return await incidentRepository.deleteIncident(id, organizationId); // Check orgId
    }
  }
  

export const incidentService = new IncidentService();
