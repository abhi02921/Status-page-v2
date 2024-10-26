"use client";
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fetchServices, addService, updateService, deleteService, deleteIncident } from '@/utils/api'; // Adjust import path as necessary
import { NewService, Service as FetchedService } from '@/interface/service.interface';
import IncidentGraph from '../incident-graph/incidentGraph';
import { Incident } from '@/interface/incident.interface';
import { io } from 'socket.io-client';
import { useUser } from '@clerk/nextjs'; // Import Clerk's useUser

// Add this type definition
type NewServiceInput = Pick<NewService, 'name' | 'description' | 'status'>;

interface ServiceComponentProps {
    incidents: Incident[];
    token: string; // Include token for API authentication
    services: FetchedService[];
    setServices: React.Dispatch<React.SetStateAction<FetchedService[]>>;
}

const ServiceComponent: React.FC<ServiceComponentProps> = ({ incidents, token, services, setServices }) => {
    const { user } = useUser(); // Get the user object with organization details
    const [newService, setNewService] = useState<NewServiceInput>({
        name: '',
        description: '',
        status: 'Operational',
    });
    const [isDialogOpen, setIsDialogOpen] = useState(false); // State for dialog open/close
    const [error, setError] = useState<string | null>(null); // State for error handling
    const [editingService, setEditingService] = useState<FetchedService | null>(null); // Track service being edited
    const [selectedService, setSelectedService] = useState<FetchedService | null>(null);
    const [isGraphDialogOpen, setIsGraphDialogOpen] = useState(false);

    const statusColors: Record<string, string> = {
        'Operational': 'bg-green-500',
        'Degraded Performance': 'bg-yellow-500',
        'Partial Outage': 'bg-orange-500',
        'Major Outage': 'bg-red-500',
    };

    // Determine if the user is an admin
    const isAdmin = user?.organizationMemberships?.some((membership) =>
        membership.role === "org:admin"
    );

    // Fetch services on component mount
    useEffect(() => {
        const loadServices = async () => {
            if (token) {
                try {
                    const fetchedServices = await fetchServices(token);
                    setServices(fetchedServices);
                } catch (error) {
                    console.error('Error fetching services:', error);
                    setError('Failed to load services');
                }
            }
        };

        loadServices();
    }, [token]);

    useEffect(() => {
        // Connect to the WebSocket server
        const socket = io("wss://status-page-kappa.vercel.app", {
            reconnectionAttempts: 5, // Number of reconnection attempts
            reconnectionDelay: 1000,
            transports: ['websocket', 'polling'] // Delay between each attempt (in ms)
        });

        // Listen for service updates
        socket.on('service', (data) => {
            const { action, service, serviceId } = data;

            setServices((prevServices) => {
                if (action === 'create') {
                    // Add the new service to the list
                    return [...prevServices, service];
                } else if (action === 'update') {
                    // Update the service in the list
                    return prevServices.map((service) =>
                        service._id === serviceId ? service : service
                    );
                } else if (action === 'delete') {
                    // Remove the service from the list
                    return prevServices.filter((service) => service._id !== serviceId);
                }
                return prevServices;
            });
        });

        // Cleanup on component unmount
        return () => {
            socket.disconnect();
        };
    }, []);

    // Handle Create/Update Service
    const handleServiceSubmit = async () => {
        if (!isAdmin) return; // Prevent non-admins from submitting services

        try {
            if (editingService) {
                // Update existing service
                const updatedService = await updateService(editingService._id, newService, token);

                setServices((prevServices: FetchedService[]) =>
                    prevServices.map((service) =>
                        service._id === editingService._id ? updatedService : service
                    )
                );
            } else {
                // Create new service
                await addService(newService, token);
            }

            // Reset form and close dialog
            setNewService({ name: '', description: '', status: 'Operational' });
            setEditingService(null);
            setIsDialogOpen(false);
        } catch (error) {
            console.error('Error adding or updating service:', error);
            setError('Failed to create/update service');
        }
    };

    // Handle Edit button
    const handleEditService = (service: FetchedService) => {
        if (!isAdmin) return; // Prevent non-admins from editing services

        setEditingService(service);
        setNewService({
            name: service.name,
            description: service.description,
            status: service.status,
        });
        setIsDialogOpen(true);
    };

    // Handle Delete Service
    const handleDeleteService = async (id: string) => {
        if (!isAdmin) return; // Prevent non-admins from deleting services

        try {
            for (const incident of incidents && incidents.filter(incident => (incident.service).toString() === id)) {
                await deleteIncident(incident._id, token);
            }
            await deleteService(id, token);
            setServices((prevServices) => prevServices.filter((service) => service._id !== id));

        } catch (error) {
            console.error('Error deleting service:', error);
            setError('Failed to delete service');
        }
    };

    const handleViewGraph = (service: FetchedService) => {
        setSelectedService(service);
        setIsGraphDialogOpen(true);
    };

    return (
        <div className="mb-8">
            {error && <div className="text-red-500 mb-4">{error}</div>} {/* Display error message */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Services</h2>
                {isAdmin && ( // Only show Add Service button to admins
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={() => {
                                setEditingService(null); // Clear editing state
                                setIsDialogOpen(true);
                            }}>
                                Add Service
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{editingService ? 'Edit Service' : 'Create New Service'}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <Input
                                    placeholder="Service Name"
                                    value={newService.name}
                                    onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                                />
                                <Textarea
                                    placeholder="Description"
                                    value={newService.description}
                                    onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                                />
                                <Select
                                    value={newService.status}
                                    onValueChange={(value) => setNewService({ ...newService, status: value as NewService['status'] })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.keys(statusColors).map((status) => (
                                            <SelectItem key={status} value={status}>
                                                {status}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleServiceSubmit}>
                                    {editingService ? 'Update Service' : 'Create Service'}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {services && services.map((service) => (
                    <Card key={service._id}>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <CardTitle>{service.name}</CardTitle>
                                <Badge className={`${statusColors[service.status]} text-white`}>
                                    {service.status}
                                </Badge>
                            </div>
                            <CardDescription>{service.description}</CardDescription>
                            <div className="flex justify-end space-x-2 mt-4">
                                {isAdmin && ( // Only show Edit and Delete buttons to admins
                                    <>
                                        <Button variant="outline" size="sm" onClick={() => handleEditService(service)}>
                                            Edit
                                        </Button>
                                        <Button variant="destructive" size="sm" onClick={() => handleDeleteService(service._id)}>
                                            Delete
                                        </Button>
                                    </>
                                )}
                                <Button onClick={() => handleViewGraph(service)} variant="outline" size="sm">
                                    View Incidents
                                </Button>
                            </div>
                        </CardHeader>
                    </Card>
                ))}
            </div>

            {/* Incident Graph Modal */}
            <Dialog open={isGraphDialogOpen} onOpenChange={setIsGraphDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{selectedService?.name} - Incident History</DialogTitle>
                    </DialogHeader>
                    {selectedService && (
                        <IncidentGraph
                            incidents={incidents.filter(
                                (incident) => incident.service._id === selectedService._id
                            )}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ServiceComponent;
