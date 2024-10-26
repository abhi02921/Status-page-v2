"use client";

import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { SignInButton, SignedIn, SignedOut } from '@clerk/nextjs';
import { Button } from "@/components/ui/button";
import Image from 'next/image';

export default function HomePage() {
  const router = useRouter();
  const { isSignedIn } = useUser();

  // Redirect user to /check-organization if signed in
  useEffect(() => {
    if (isSignedIn) {
      router.push('/check-organization');
    }
  }, [isSignedIn, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <h1 className="text-5xl font-extrabold text-gray-900 mb-4">Welcome to Status Page App</h1>
      <p className="text-lg text-gray-600 mb-8 text-center">
        Monitor and manage the status of your services effortlessly.
      </p>

      <Image
        src="/images/status-page-example.png"
        alt="Status Page Example"
        width={500}
        height={300}
        className="rounded-lg shadow-md mb-8"
      />

      <SignedOut>
        <SignInButton mode="modal">
          <Button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold text-lg px-6 py-3">
            Sign In to Get Started
          </Button>
        </SignInButton>
      </SignedOut>
    </div>
  );
}
