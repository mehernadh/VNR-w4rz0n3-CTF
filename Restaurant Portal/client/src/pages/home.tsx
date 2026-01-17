import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/lib/auth';

export default function Home() {
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      setLocation('/dashboard');
    } else {
      setLocation('/login');
    }
  }, [isAuthenticated, setLocation]);

  return <div>Redirecting...</div>;
}
