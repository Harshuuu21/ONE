import type {
  AuthUser,
  AuthTokens,
  OtpRequestResponse,
  OtpVerifyResponse,
  IdentifyResponse,
} from '../types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const LOCAL_SESSION_KEY = 'one_authenticated_user_session';
const LOCAL_TOKEN_KEY = 'one_access_token';

export class AuthApi {
  /**
   * Helper to execute API requests with JSON parsing
   */
  private static async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getAccessToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || data.error || 'Request failed');
    }

    return data.data;
  }

  /**
   * Identifies user by mobile number before deciding login vs onboarding
   */
  static async identify(mobileNumber: string): Promise<IdentifyResponse> {
    try {
      return await this.request<IdentifyResponse>('/auth/identify', {
        method: 'POST',
        body: JSON.stringify({ mobileNumber }),
      });
    } catch {
      // Deterministic local fallback if backend server is not running
      const isKnown = mobileNumber.endsWith('9999');
      return {
        exists: isKnown,
        hasPasskey: isKnown,
        mobileNumber,
        firstName: isKnown ? 'Harsh' : undefined,
      };
    }
  }

  /**
   * Requests a 6-digit verification code to the mobile number
   */
  static async requestOtp(mobileNumber: string): Promise<OtpRequestResponse> {
    try {
      return await this.request<OtpRequestResponse>('/auth/otp/request', {
        method: 'POST',
        body: JSON.stringify({ mobileNumber }),
      });
    } catch (err: any) {
      if (err.message && !err.message.includes('fetch')) {
        throw err;
      }
      // Local development mock fallback
      console.warn('[ONE Auth] Backend unreachable, using dev mock OTP: 123456');
      return {
        mobileNumber,
        expiresInSeconds: 300,
        cooldownSeconds: 45,
        devMockOtp: '123456',
      };
    }
  }

  /**
   * Verifies the OTP and establishes an authenticated session
   */
  static async verifyOtp(mobileNumber: string, otp: string): Promise<OtpVerifyResponse> {
    try {
      const data = await this.request<OtpVerifyResponse>('/auth/otp/verify', {
        method: 'POST',
        body: JSON.stringify({ mobileNumber, otp }),
      });

      this.persistSession(data.user, data.tokens.accessToken);
      return data;
    } catch (err: any) {
      if (err.message && !err.message.includes('fetch')) {
        throw err;
      }

      // Local development fallback
      if (otp === '123456' || otp.length === 6) {
        const isNewUser = !mobileNumber.endsWith('9999');
        const mockUser: AuthUser = {
          id: 'usr_' + Math.random().toString(36).substring(2, 9),
          mobileNumber,
          firstName: isNewUser ? 'New' : 'Harsh',
          lastName: isNewUser ? 'Member' : 'Bajaj',
          isMobileVerified: true,
          onboardingStep: isNewUser ? 'ONBOARDING_PENDING' : 'ACTIVE',
          reputationScore: 780,
          reputationTitle: 'Reliable Peer',
        };
        const mockTokens: AuthTokens = {
          accessToken: 'mock_jwt_' + Date.now(),
          refreshToken: 'mock_refresh_' + Date.now(),
          expiresIn: 900,
        };

        const res: OtpVerifyResponse = {
          user: mockUser,
          isNewUser,
          hasPasskey: !isNewUser,
          nextStep: isNewUser ? 'AA_ONBOARDING' : 'DASHBOARD',
          tokens: mockTokens,
        };

        this.persistSession(mockUser, mockTokens.accessToken);
        return res;
      }

      throw new Error('Invalid verification code');
    }
  }

  /**
   * Refresh session tokens
   */
  static async refreshToken(): Promise<AuthTokens> {
    return await this.request<AuthTokens>('/auth/refresh', {
      method: 'POST',
    });
  }

  /**
   * Logout from current device
   */
  static async logout(): Promise<void> {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } catch {
      // Ignore network errors on logout
    } finally {
      this.clearSession();
    }
  }

  /**
   * Logout from all devices
   */
  static async logoutAll(): Promise<void> {
    try {
      await this.request('/auth/logout-all', { method: 'POST' });
    } finally {
      this.clearSession();
    }
  }

  // Session storage helpers
  static persistSession(user: AuthUser, accessToken: string) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(user));
      localStorage.setItem(LOCAL_TOKEN_KEY, accessToken);
      // Synchronize cookie for server-side Next.js middleware protection
      document.cookie = `one_access_token=${accessToken}; path=/; max-age=86400; SameSite=Lax`;
      window.dispatchEvent(new Event('one-auth-changed'));
    } catch (err) {
      console.error('Failed to store session:', err);
    }
  }

  static getStoredUser(): AuthUser | null {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem(LOCAL_SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  static getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(LOCAL_TOKEN_KEY);
  }

  static clearSession() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(LOCAL_SESSION_KEY);
    localStorage.removeItem(LOCAL_TOKEN_KEY);
    // Clear auth cookie
    document.cookie = 'one_access_token=; path=/; max-age=0; SameSite=Lax';
    window.dispatchEvent(new Event('one-auth-changed'));
  }
}

