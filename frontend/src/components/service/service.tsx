import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fetchServices, addService, updateService, deleteService, deleteIncident, fetchIncidents } from '@/utils/api'; // Adjust import path as necessary
import { NewService, Service as FetchedService } from '@/interface/service.interface';
import IncidentGraph from '../incident-graph/incidentGraph';
import { Incident } from '@/interface/incident.interface';
import { useAuth, useUser } from '@clerk/nextjs'; // Import Clerk's useUser



interface ServiceComponentProps {

}

const ServiceComponent: React.FC<ServiceComponentProps> = ({ }) => {
    const { getToken } = useAuth();
    const { user } = useUser(); // Get the user object with organization details
    const [token, setToken] = useState<string | null>(null);
    const [newService, setNewService] = useState<NewService>({
        name: '',
        description: '',
        status: 'Operational',
    });
    const [isDialogOpen, setIsDialogOpen] = useState(false); // State for dialog open/close
    const [error, setError] = useState<string | null>(null); // State for error handling
    const [editingService, setEditingService] = useState<FetchedService | null>(null); // Track service being edited
    const [selectedService, setSelectedService] = useState<FetchedService | null>(null);
    const [isGraphDialogOpen, setIsGraphDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false); // Add loading state

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


    useEffect(() => {
        const fetchToken = async () => {
            const token = await getToken();
            if (token) {
                setToken(token);
            }
        };
        fetchToken();
    }, [getToken]);

    // SWR: Fetch services and incidents
    const { data: services, error: servicesError, mutate: mutateServices } = useSWR(
        token ? ['/api/services', token] : null,
        () => fetchServices(token as string), { refreshInterval: 2000 }
    );

    const { data: incidents, error: incidentsError, mutate: mutateIncidents } = useSWR(
        token ? ['/api/incidents', token] : null,
        () => fetchIncidents(token as string), { refreshInterval: 2000 }
    );

    if (servicesError) return <div>Error loading services</div>;
    if (incidentsError) return <div>Error loading incidents</div>;
    if (!services || !incidents) return <div>Loading...</div>;

    // Handle Create/Update Service
    const handleServiceSubmit = async () => {
        if (!isAdmin) return; // Prevent non-admins from submitting services

        setLoading(true); // Start loading
        try {
            if (editingService) {
                // Update existing service
                const updatedService = await updateService(editingService._id, newService, token as string);

                mutateServices(prevServices => {
                    if (!prevServices || prevServices.length === 0) {
                        return [updatedService];
                    }
                    return prevServices.map((service) =>
                        service._id === editingService._id ? updatedService : service
                    );
                }, false); // Optimistic update

            } else {
                // Create new service
                await addService(newService, token as string);
                mutateServices(); // Revalidate after adding new service
            }

            // Reset form and close dialog
            setNewService({ name: '', description: '', status: 'Operational' });
            setEditingService(null);
            setIsDialogOpen(false);
        } catch (error) {
            console.error('Error adding or updating service:', error);
            setError('Failed to create/update service');
        } finally {
            setLoading(false); // End loading
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

        setLoading(true); // Start loading
        try {
            // Delete all incidents linked to the service
            const relatedIncidents = incidents.filter((incident: Incident) => incident.service._id === id);
            await Promise.all(relatedIncidents.map((incident: Incident) => deleteIncident(incident._id, token as string)));

            // Delete the service itself
            await deleteService(id, token as string);

            // Mutate both services and incidents after deletion
            mutateServices(); // Revalidate services
            mutateIncidents(); // Revalidate incidents

        } catch (error) {
            console.error('Error deleting service:', error);
            setError('Failed to delete service');
        } finally {
            setLoading(false); // End loading
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
                                <Button onClick={handleServiceSubmit} disabled={loading}>
                                    {loading ? 'Processing...' : (editingService ? 'Update Service' : 'Create Service')}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.map((service) => (
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
                                        <Button variant="outline" size="sm" onClick={() => handleEditService(service)} disabled={loading}>
                                            Edit
                                        </Button>
                                        <Button variant="destructive" size="sm" onClick={() => handleDeleteService(service._id)} disabled={loading}>
                                            {loading ? 'Deleting...' : 'Delete'}
                                        </Button>
                                    </>
                                )}
                                <Button onClick={() => handleViewGraph(service)} variant="outline" size="sm" disabled={loading}>
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
