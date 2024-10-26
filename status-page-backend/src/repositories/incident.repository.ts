import { IIncident, Incident } from '../models/incident.model';

class IncidentRepository {
  // Create incident with service and organizationId
  async createIncident(data: Partial<IIncident>): Promise<IIncident> {
    const incident = new Incident(data);
    return await incident.save();
  }

  // Get an incident by ID, scoped to organization
  async getIncidentById(id: string, orgId: string): Promise<IIncident | null> {
    return await Incident.findOne({ _id: id, organizationId: orgId }).populate('service');
  }

  // Get all incidents, scoped to organization
  async getAllIncidents(orgId: string): Promise<IIncident[]> {
    return await Incident.find({ organizationId: orgId }).populate('service');
  }

  // Update incident, scoped to organization
  async updateIncident(id: string, data: Partial<IIncident>, orgId: string): Promise<IIncident | null> {
    return await Incident.findOneAndUpdate(
      { _id: id, organizationId: orgId }, // Ensure organization context
      data,
      { new: true } // Return the updated document
    ).populate('service');
  }

  // Delete an incident, scoped to organization
  async deleteIncident(id: string, orgId: string): Promise<IIncident | null> {
    return await Incident.findOneAndDelete({ _id: id, organizationId: orgId });
  }
}

export const incidentRepository = new IncidentRepository();
