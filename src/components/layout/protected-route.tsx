"use client";
import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      router.replace('/login');
    } else {
      setIsChecking(false);
    }
  }, [router, pathname]);

  if (isChecking) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f8f9fa' }}>
        <div style={{ color: '#6c757d', fontFamily: 'var(--font-body)', fontWeight: 600 }}>Memuat Workspace...</div>
      </div>
    );
  }

  return <>{children}</>;
}
