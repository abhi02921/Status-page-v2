import { CreateIncident, Incident } from "@/interface/incident.interface";
import { NewService, Service } from "@/interface/service.interface";

// Base URL for your API
const BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}`;


// Function to fetch all services
export const fetchServices = async (token: string): Promise<Service[]> => {
    const response = await fetch(`${BASE_URL}/services`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        throw new Error('Failed to fetch services');
    }
    const result = await response.json();
    return result.data; // Adjust based on your API response structure
};

// Function to add a new service
export const addService = async (newService: NewService, token: string): Promise<Service> => {
    const response = await fetch(`${BASE_URL}/services`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newService),
    });
    if (!response.ok) {
        throw new Error('Failed to add service');
    }
    const result = await response.json();
    return result.data; // Adjust based on your API response structure
};

// Function to update a service
export const updateService = async (id: string, updatedService: Omit<NewService, 'id'>, token: string): Promise<Service> => {
    const response = await fetch(`${BASE_URL}/services/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedService),
    });
    if (!response.ok) {
        throw new Error('Failed to update service');
    }
    const result = await response.json();
    return result.data; // Adjust based on your API response structure
};

// Function to delete a service
export const deleteService = async (id: string, token: string): Promise<void> => {
    const response = await fetch(`${BASE_URL}/services/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        throw new Error('Failed to delete service');
    }
};

// Function to fetch all incidents
export const fetchIncidents = async (token: string): Promise<Incident[]> => {
    try {
        const response = await fetch(`${BASE_URL}/incidents`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch incidents');
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error fetching incidents:', error);
        throw error;
    }
};
// Function to add a new incident
export const addIncident = async (incidentData: CreateIncident, token: string): Promise<Incident> => {
    const response = await fetch(`${BASE_URL}/incidents`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(incidentData),
    });

    if (!response.ok) {
        throw new Error('Failed to create incident');
    }

    const data = await response.json();
    return data.data; // Adjust based on your API response structure
};

// Function to update an existing incident
export const updateIncident = async (id: string, incidentData: Omit<CreateIncident, 'id'>, token: string): Promise<Incident> => {
    console.log(incidentData);
    const response = await fetch(`${BASE_URL}/incidents/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(incidentData),
    });

    if (!response.ok) {
        throw new Error('Failed to update incident');
    }

    const data = await response.json();
    return data.data; // Adjust based on your API response structure
};

// Function to delete an incident
export const deleteIncident = async (id: string, token: string): Promise<void> => {
    const response = await fetch(`${BASE_URL}/incidents/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to delete incident');
    }

    return; // No data to return on successful deletion
};
