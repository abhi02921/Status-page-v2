
export interface Incident {
    _id: string;
    title: string;
    description: string;
    service: Service; // Assuming each incident is associated with a service
    status: 'Operational' | 'Degraded Performance' | 'Partial Outage' | 'Major Outage';
    createdAt: Date;
}

export interface CreateIncident {
    title: string;
    description: string;
    service: string; // Assuming each incident is associated with a service
    status: 'Operational' | 'Degraded Performance' | 'Partial Outage' | 'Major Outage';
}

export interface Service {
    _id: string; // Assuming this is the unique identifier for the service, you may want to map this to _id if that's the source
    name: string;
    description: string; // Added based on the new structure
    organizationId: string; // Added based on the new structure
    status: 'Operational' | 'Degraded Performance' | 'Partial Outage' | 'Major Outage'; // Keep this if it matches your API
    createdAt: string; // Added for creation date
    updatedAt: string; // Added for last updated date
    __v: number; // Version key from the database, if needed
}
