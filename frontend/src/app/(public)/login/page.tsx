import { AuthenticationFlow } from '@/features/authentication/components/AuthenticationFlow';

export default function LoginPage() {
  return <AuthenticationFlow initialStep="MOBILE_INPUT" />;
}
