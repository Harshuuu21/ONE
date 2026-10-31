import { useAuth as useAuthContext } from '@/contexts/AuthProvider';

export function useAuth() {
  return useAuthContext();
}
