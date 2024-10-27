"use client";
import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from '../ui/badge';
import { CreateIncident, Incident } from '@/interface/incident.interface';
import { fetchIncidents, addIncident, updateIncident, deleteIncident, fetchServices } from '@/utils/api';
import { useUser } from '@clerk/nextjs';

interface IncidentComponentProps {
    token: string;
}

const IncidentComponent: React.FC<IncidentComponentProps> = ({ token }) => {
    const { user } = useUser();
    const [newIncident, setNewIncident] = useState<CreateIncident>({
        title: '',
        description: '',
        status: 'Operational',
        service: ''
    });
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingIncident, setEditingIncident] = useState<Incident | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false); // Track loading state for CRUD operations

    const statusColors: Record<string, string> = {
        'Operational': 'bg-green-500',
        'Degraded Performance': 'bg-yellow-500',
        'Partial Outage': 'bg-orange-500',
        'Major Outage': 'bg-red-500',
    };

    const isAdmin = user?.organizationMemberships?.some((membership) =>
        membership.role === "org:admin"
    );


    const { data: services, error: servicesError, mutate: mutateServices } = useSWR(
        token ? ['/api/services', token] : null,
        () => fetchServices(token as string),
        { refreshInterval: 20000, revalidateOnFocus: false } // Increase refresh interval and disable revalidateOnFocus
    );

    const { data: incidents, error, mutate } = useSWR(
        token ? ['/api/incidents', token] : null,
        () => fetchIncidents(token as string),
        { refreshInterval: 20000, revalidateOnFocus: false } // Increase refresh interval and disable revalidateOnFocus
    );
    const [localIncidents, setLocalIncidents] = useState<Incident[]>([]); // Local caching for incidents
    // Set local incidents when SWR fetches new data
    useEffect(() => {
        if (incidents) {
            setLocalIncidents(incidents);
        }
    }, [incidents]);

    if (error) return <div>Failed to load incidents</div>;
    if (!incidents) return <div>Loading incidents...</div>;

    // Handle Create/Update Incident
    const handleIncidentSubmit = async () => {
        if (!isAdmin) return;

        if (!newIncident.title || !newIncident.description || !newIncident.service || !newIncident.status) {
            setErrorMessage("All fields are required.");
            return;
        } else {
            setErrorMessage(null);
        }

        setLoading(true); // Set loading to true when starting the operation

        try {
            if (editingIncident && token) {
                const updatedIncident = await updateIncident(editingIncident._id, newIncident, token);
                setLocalIncidents(localIncidents.map(incident => incident._id === updatedIncident._id ? updatedIncident : incident));
                mutate();

            } else {
                if (token) {
                    const newIncidentResponse = await addIncident({ ...newIncident }, token);
                    setLocalIncidents([...localIncidents, newIncidentResponse]);
                    mutate();
                }
            }
        } catch (error) {
            console.error("Failed to submit incident:", error);
        } finally {
            setLoading(false); // Reset loading state after operation completes
        }

        // Reset form and close dialog
        setNewIncident({ title: '', description: '', status: 'Operational', service: '' });
        setEditingIncident(null);
        setIsDialogOpen(false);
    };

    // Handle Delete Incident
    const handleDeleteIncident = async (id: string) => {
        if (!isAdmin) return;

        setLoading(true); // Set loading to true when starting the operation

        try {
            if (token) {
                await deleteIncident(id, token);
                setLocalIncidents(localIncidents.filter(incident => incident._id !== id));
                mutate(); // Re-fetch incidents
            }
        } catch (error) {
            console.error("Failed to delete incident:", error);
        } finally {
            setLoading(false); // Reset loading state after operation completes
        }
    };

    // Handle Edit Button
    const handleEditIncident = (incident: Incident) => {
        if (!isAdmin) return;

        setEditingIncident(incident);
        setNewIncident({
            ...incident,
            service: (incident.service as any).toString() // Ensure service is in string format
        });
        setIsDialogOpen(true);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Incidents</h2>
                {isAdmin && (
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={() => {
                                setEditingIncident(null);
                                setIsDialogOpen(true);
                            }}>
                                {editingIncident ? 'Edit Incident' : 'Report Incident'}
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{editingIncident ? 'Edit Incident' : 'Report New Incident'}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                {errorMessage && (
                                    <Alert>
                                        <AlertDescription className="text-red-600">{errorMessage}</AlertDescription>
                                    </Alert>
                                )}
                                <Input
                                    placeholder="Incident Title"
                                    value={newIncident.title}
                                    onChange={(e) => setNewIncident({ ...newIncident, title: e.target.value })}
                                />
                                <Textarea
                                    placeholder="Description"
                                    value={newIncident.description}
                                    onChange={(e) => setNewIncident({ ...newIncident, description: e.target.value })}
                                />
                                <Select
                                    value={newIncident.service}
                                    onValueChange={(value) => setNewIncident({ ...newIncident, service: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Service" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {services?.map((service) => (
                                            <SelectItem key={service._id} value={service._id}>
                                                {service.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Select
                                    value={newIncident.status}
                                    onValueChange={(value) => setNewIncident({ ...newIncident, status: value as Incident['status'] })}
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
                                <Button onClick={handleIncidentSubmit} disabled={loading}>
                                    {loading ? 'Processing...' : (editingIncident ? 'Update Incident' : 'Create Incident')}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                )}
            </div>
            <ScrollArea className="h-[500px] rounded-md border p-4">
                <div className="space-y-4">
                    {incidents.map((incident) => (
                        <Alert key={incident._id}>
                            <div className="flex items-start space-x-4">
                                <div className="min-w-[150px] text-sm text-gray-500">
                                    {new Date(incident.createdAt).toLocaleString()}
                                </div>
                                <AlertDescription className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold">{incident.title}</h3>
                                            <p className="text-sm text-gray-600">{incident.description}</p>
                                            <p className="text-sm text-gray-500 mt-1">
                                                Service: {services?.find(s => s._id === incident.service._id)?.name}
                                            </p>
                                        </div>
                                        <Badge className={`${statusColors[incident.status]} text-white`}>
                                            {incident.status}
                                        </Badge>
                                        {isAdmin && (
                                            <div className="space-x-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleEditIncident(incident)}
                                                    disabled={loading}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleDeleteIncident(incident._id)}
                                                    disabled={loading}
                                                >
                                                    {loading ? 'Deleting...' : 'Delete'}
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </AlertDescription>
                            </div>
                        </Alert>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
};

export default IncidentComponent;
