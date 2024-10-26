"use client";
import React, { useState, useEffect } from 'react';
import { useAuth, UserButton, useUser } from '@clerk/nextjs';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import IncidentComponent from '@/components/incident/IncidentComponent';
import ServiceComponent from '@/components/service/service';
import { fetchIncidents, fetchServices } from '@/utils/api'; // Import the fetchServices function
import { Service } from '@/interface/service.interface';
import { Incident } from '@/interface/incident.interface';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

const Dashboard: React.FC = () => {
    const { getToken } = useAuth();
    const { user } = useUser();
    const [isOrgProfileOpen, setIsOrgProfileOpen] = useState(false);
    const [services, setServices] = useState<Service[]>([]);
    const [token, setToken] = useState<string | null>(null); // State for the authentication token
    const [loadingServices, setLoadingServices] = useState(true); // State to handle loading
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [loadingIncidents, setLoadingIncidents] = useState(true);
    // Fetch the token from Clerk when user is authenticated
    useEffect(() => {
        const fetchToken = async () => {
            const token = await getToken(); // Await the token retrieval
            if (token) {
                setToken(token); // Set the token
            }
        };
        fetchToken();
    }, [getToken]); // Dependency on getToken, not token


    // Fetch services when the token is available
    useEffect(() => {
        const loadServices = async () => {
            if (token) {
                try {
                    setLoadingServices(true); // Start loading
                    const fetchedServices = await fetchServices(token);
                    setServices(fetchedServices); // Update services state
                } catch (error) {
                    console.error('Failed to fetch services:', error);
                } finally {
                    setLoadingServices(false); // End loading
                }
            }
        };

        loadServices();
    }, [token]); // Fetch services whenever the token changes


    // Fetch services when the token is available
    useEffect(() => {
        const loadIncidents = async () => {
            if (token) {
                try {
                    setLoadingIncidents(true); // Start loading
                    const fetchedIncidents = await fetchIncidents(token);
                    setIncidents(fetchedIncidents); // Update services state
                } catch (error) {
                    console.error('Failed to fetch incidents:', error);
                } finally {
                    setLoadingIncidents(false); // End loading
                }
            }
        };

        loadIncidents();
    }, [token]); // Fetch services whenever the token changes

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Navbar */}
            <header className="bg-white shadow-md p-6 flex justify-between items-center rounded-lg mb-6">
                <div className="flex items-center justify-between w-full space-x-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {user?.organizationMemberships?.[0]?.organization?.name || "My Organization"}
                    </h2>
                    <Dialog open={isOrgProfileOpen} onOpenChange={setIsOrgProfileOpen}>
                        <DialogTrigger asChild>
                            <Button
                                className="w-1/2 sm:w-auto"
                                variant="outline"
                                onClick={() => setIsOrgProfileOpen(true)}
                            >
                                Organization Settings
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="w-[90vw] h-auto max-w-3xl">
                            <VisuallyHidden>
                                <DialogTitle>Organization Profile</DialogTitle> {/* Hidden but accessible */}
                            </VisuallyHidden>
                            <div className="h-[600px] w-full overflow-y-auto overflow-x-auto">
                                <iframe
                                    src="/organization-profile"
                                    className="w-full h-full border-none"
                                    title="Organization Profile"
                                />
                            </div>
                        </DialogContent>
                    </Dialog>
                    <UserButton />
                </div>
            </header>

            {/* Main Content */}
            <div className="flex flex-col items-center justify-center mt-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                    Welcome to your Dashboard, {user?.firstName}!
                </h1>
                <p className="text-lg text-gray-600 mb-6 text-center max-w-2xl">
                    Manage your services and view their statuses here.
                </p>
            </div>

            {/* Services Section */}
            {!loadingServices && token && (
                <ServiceComponent incidents={incidents} token={token} services={services} setServices={setServices} />
            )}

            {/* Incidents Section */}
            {!loadingServices && services.length > 0 && token ? (
                <IncidentComponent services={services} incidents={incidents} setIncidents={setIncidents} token={token} />
            ) : (
                <p>Loading services...</p>
            )}
        </div>
    );
};

export default Dashboard;
