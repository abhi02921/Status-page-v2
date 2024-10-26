export interface CreateIncidentDTO {
  title: string;
  description: string;
  status?: 'Operational' | 'Degraded Performance' | 'Partial Outage' | 'Major Outage';
  service: string; // service ID as string
  organizationId: string; // Organization ID to link the incident
}

export interface UpdateIncidentDTO {
  title?: string;
  description?: string;
  status?: 'Operational' | 'Degraded Performance' | 'Partial Outage' | 'Major Outage';
  service?: string; // Optional if changing service association
}
