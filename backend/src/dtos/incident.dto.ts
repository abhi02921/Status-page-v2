export interface CreateIncidentDTO {
  title: string;
  description: string;
  status?: string;
  service: string; // service ID as string
  organizationId: string; // Organization ID to link the incident
}

export interface UpdateIncidentDTO {
  title?: string;
  description?: string;
  status?: string;
  service?: string; // Optional if changing service association
}
