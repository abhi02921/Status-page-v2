"use client";

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { CreateOrganization } from '@clerk/nextjs';

export default function CheckOrganization() {
    const { isSignedIn } = useUser();
    const { user } = useUser();
    const router = useRouter();

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isSignedIn) {
            router.push('/'); // If not signed in, redirect to home page
        } else if (user?.organizationMemberships && user?.organizationMemberships.length > 0) {
            router.push('/dashboard'); // If user is in an organization, go to dashboard
        } else {
            setLoading(false); // If user is not in any organization, stop loading
        }
    }, [isSignedIn, user?.organizationMemberships, router]);

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
            <h1 className="text-3xl font-semibold mb-4">Create or Join an Organization</h1>
            <p className="mb-6 text-gray-600">
                You are not part of an organization yet. Create one to get started.
            </p>

            {/* CreateOrganization Component */}
            <CreateOrganization
                afterCreateOrganizationUrl="/dashboard"  // Redirect to dashboard after org creation
                appearance={{
                    elements: {
                        formButtonPrimary: 'bg-blue-500 hover:bg-blue-600 text-white', // Shadcn style
                    },
                }}
            />

            <div className="mt-4">
                <Button className="bg-gray-500 hover:bg-gray-600 text-white" onClick={() => router.push('/')}>
                    Go Back
                </Button>
            </div>
        </div>
    );
}
