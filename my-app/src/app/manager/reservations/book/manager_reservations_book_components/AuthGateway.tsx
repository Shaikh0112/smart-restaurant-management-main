import React from 'react';
import Link from 'next/link';
import { User } from 'lucide-react';

interface AuthGatewayProps {
  tenantIdParam: string;
}

export function AuthGateway({ tenantIdParam }: AuthGatewayProps) {
  return (
    <div className="rounded-3xl border border-border/80 bg-card p-8 shadow-xl flex flex-col items-center justify-center gap-6 max-w-md mx-auto w-full text-center mt-10">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-2">
        <User size={32} />
      </div>
      <div>
        <h2 className="font-black text-2xl text-text-primary mb-2">
          Authentication Required
        </h2>
        <p className="text-sm text-text-secondary mb-6">
          Please log in or create a customer account to continue with your advance table booking.
        </p>
      </div>
      
      <Link 
        href={`/auth/login?redirect=${encodeURIComponent(`/manager/reservations/book?tenant=${tenantIdParam}`)}`}
        className="w-full rounded-xl bg-primary py-3.5 text-sm font-black text-white hover:bg-primary/90 transition-all shadow-md flex items-center justify-center gap-2"
      >
        <User size={18} />
        Continue to Login / Sign Up
      </Link>
    </div>
  );
}
