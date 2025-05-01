"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/api';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    if (authService.isAuthenticated()) {
      const user = authService.getCurrentUser();
      
      // Redirect based on user role
      if (user) {
        if (user.role === 'admin') {
          router.push('/admin/dashboard');
        } else if (user.role === 'coach') {
          router.push('/coach/dashboard');
        } else {
          router.push('/student/dashboard');
        }
      } else {
        router.push('/dashboard');
      }
    } else {
      // Not logged in, redirect to login page
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p>Redirecting...</p>
    </div>
  );
}