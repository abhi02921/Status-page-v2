// app/organization-profile/page.tsx
"use client";
import { OrganizationProfile } from '@clerk/nextjs';

export default function OrganizationProfilePage() {
    return (
        <OrganizationProfile
            appearance={{
                elements: {
                    formButtonPrimary: 'bg-blue-500 hover:bg-blue-600 text-white',
                },
            }}
            routing="hash"
        />
    );
}