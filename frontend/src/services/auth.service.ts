import { AuthApi } from '@/features/authentication/services/authApi';
import type { AuthUser } from '@/features/authentication/types';

export class AuthService {
  static async requestOtp(mobileNumber: string) {
    return AuthApi.requestOtp(mobileNumber);
  }

  static async verifyOtp(mobileNumber: string, otp: string) {
    return AuthApi.verifyOtp(mobileNumber, otp);
  }

  static async logout() {
    return AuthApi.logout();
  }

  static async logoutAll() {
    return AuthApi.logoutAll();
  }

  static getStoredUser(): AuthUser | null {
    return AuthApi.getStoredUser();
  }

  static getAccessToken(): string | null {
    return AuthApi.getAccessToken();
  }

  // Graceful compatibility fallback for demo/test mode
  static async demoLogin() {
    return AuthApi.verifyOtp('+919876543210', '123456');
  }

  static subscribeToAuthUpdates(callback: (user: AuthUser | null) => void) {
    const handler = () => {
      callback(AuthApi.getStoredUser());
    };
    window.addEventListener('one-auth-changed', handler);
    return () => window.removeEventListener('one-auth-changed', handler);
  }
}

export * from '@/features/authentication';
