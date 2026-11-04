import { AuthenticationFlow } from '@/features/authentication/components/AuthenticationFlow';

export default function OtpPage() {
  return <AuthenticationFlow initialStep="OTP_INPUT" />;
}
