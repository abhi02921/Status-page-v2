"use client";
import React, { useState, useEffect } from 'react';
import { UserButton, useUser } from '@clerk/nextjs';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import IncidentComponent from '@/components/incident/IncidentComponent';
import ServiceComponent from '@/components/service/service';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { useAuth } from '@clerk/nextjs';

const Dashboard: React.FC = () => {
    const { user } = useUser();
    const [isOrgProfileOpen, setIsOrgProfileOpen] = useState(false);
    const [token, setToken] = useState<string | null>(null);
    const { getToken } = useAuth();

    useEffect(() => {
        const fetchToken = async () => {
            const token = await getToken();
            if (token) {
                setToken(token);
            }
        };
        fetchToken();
    }, [getToken]);
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

            {token && <ServiceComponent token={token} />}


            {/* Incidents Section */}
            {token && <IncidentComponent token={token} />}
        </div>
    );
};

export default Dashboard;
