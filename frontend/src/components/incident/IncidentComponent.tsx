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
import { useAuth, useUser } from '@clerk/nextjs'; // Import useUser to get organization membership

interface IncidentComponentProps { }

const IncidentComponent: React.FC<IncidentComponentProps> = ({ }) => {
    const { getToken } = useAuth();
    const { user } = useUser(); // Get the user object with organization details
    const [token, setToken] = useState<string | null>(null);
    const [newIncident, setNewIncident] = useState<CreateIncident>({
        title: '',
        description: '',
        status: 'Operational',
        service: ''
    });
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingIncident, setEditingIncident] = useState<Incident | null>(null);

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

    const { data: incidents, error, mutate } = useSWR(token ? ['/api/incidents', token] : null,
        () => fetchIncidents(token as string), { refreshInterval: 2000 });

    if (error) return <div>Failed to load incidents</div>;
    if (!incidents) return <div>Loading incidents...</div>;

    // Handle Create/Update Incident
    const handleIncidentSubmit = async () => {
        if (!isAdmin) return; // Prevent non-admins from submitting

        try {
            if (editingIncident && token) {
                const updatedIncident = await updateIncident(editingIncident._id, newIncident, token);
                mutate();
            } else {
                if (token) {
                    await addIncident({ ...newIncident }, token);
                }
                mutate();
            }
        } catch (error) {
            console.error("Failed to submit incident:", error);
        }

        setNewIncident({ title: '', description: '', status: 'Operational', service: '' });
        setEditingIncident(null);
        setIsDialogOpen(false);
    };

    // Handle Delete Incident
    const handleDeleteIncident = async (id: string) => {
        if (!isAdmin) return; // Prevent non-admins from deleting

        try {
            if (token) {
                await deleteIncident(id, token);
                mutate();
            }
        } catch (error) {
            console.error("Failed to delete incident:", error);
        }
    };

    // Handle Edit Button
    const handleEditIncident = (incident: Incident) => {
        if (!isAdmin) return; // Prevent non-admins from editing

        setEditingIncident(incident);
        setNewIncident({
            ...incident,
            service: (incident.service).toString()
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
                                <Button onClick={handleIncidentSubmit}>
                                    {editingIncident ? 'Update Incident' : 'Create Incident'}
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
                                                <Button variant="outline" size="sm" onClick={() => handleEditIncident(incident)}>Edit</Button>
                                                <Button variant="destructive" size="sm" onClick={() => handleDeleteIncident(incident._id)}>Delete</Button>
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
