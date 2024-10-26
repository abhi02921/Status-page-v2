// dtos/service.dto.ts
export interface CreateServiceDTO {
    name: string;
    description?: string;
    status?: 'Operational' | 'Degraded Performance' | 'Partial Outage' | 'Major Outage';
    organizationId: string;  // Add organization ID for association
}

export interface UpdateServiceDTO {
    name?: string;
    description?: string;
    status?: 'Operational' | 'Degraded Performance' | 'Partial Outage' | 'Major Outage';
}
