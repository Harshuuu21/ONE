import {
  startRegistration,
  startAuthentication,
  browserSupportsWebAuthn,
} from '@simplewebauthn/browser';
import { AuthApi } from './authApi';
import type { AuthUser, AuthTokens } from '../types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export class PasskeyApi {
  /**
   * Checks whether the current browser supports WebAuthn / Passkeys
   */
  static isSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return browserSupportsWebAuthn();
  }

  /**
   * Registers a new passkey credential for the current authenticated user
   */
  static async registerPasskey(deviceName?: string): Promise<{ success: boolean; deviceName?: string }> {
    if (!this.isSupported()) {
      throw new Error('This browser or device does not support Passkey / WebAuthn authentication.');
    }

    const token = AuthApi.getAccessToken();
    if (!token) {
      throw new Error('You must be logged in to register a passkey.');
    }

    // 1. Fetch registration options from backend
    const optionsRes = await fetch(`${API_BASE}/auth/passkey/register/options`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ deviceName }),
      credentials: 'include',
    });

    const optionsData = await optionsRes.json();
    if (!optionsRes.ok || !optionsData.success) {
      throw new Error(optionsData.message || 'Failed to retrieve passkey registration options');
    }

    // 2. Prompt user authenticator (biometric, device PIN, or security key)
    let registrationResponse;
    try {
      registrationResponse = await startRegistration({ optionsJSON: optionsData.data });
    } catch (err: any) {
      if (err.name === 'NotAllowedError') {
        throw new Error('Passkey registration was cancelled by user or timed out.');
      }
      throw new Error(err.message || 'Authenticator interaction failed');
    }

    // 3. Send credential response to backend for verification and storage
    const verifyRes = await fetch(`${API_BASE}/auth/passkey/register/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        response: registrationResponse,
        deviceName,
      }),
      credentials: 'include',
    });

    const verifyData = await verifyRes.json();
    if (!verifyRes.ok || !verifyData.success) {
      throw new Error(verifyData.message || 'Failed to verify passkey with server');
    }

    return verifyData.data;
  }

  /**
   * Logs in using an existing registered passkey
   */
  static async loginWithPasskey(mobileNumber?: string): Promise<{ user: AuthUser; tokens: AuthTokens }> {
    if (!this.isSupported()) {
      throw new Error('This browser or device does not support Passkey / WebAuthn authentication.');
    }

    // 1. Fetch authentication options from backend
    const optionsRes = await fetch(`${API_BASE}/auth/passkey/login/options`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobileNumber }),
      credentials: 'include',
    });

    const optionsData = await optionsRes.json();
    if (!optionsRes.ok || !optionsData.success) {
      throw new Error(optionsData.message || 'Failed to start passkey authentication');
    }

    // 2. Prompt user authenticator
    let authenticationResponse;
    try {
      authenticationResponse = await startAuthentication({ optionsJSON: optionsData.data });
    } catch (err: any) {
      if (err.name === 'NotAllowedError') {
        throw new Error('Passkey authentication was cancelled or timed out.');
      }
      throw new Error(err.message || 'Passkey authentication failed');
    }

    // 3. Send assertion to backend
    const verifyRes = await fetch(`${API_BASE}/auth/passkey/login/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ response: authenticationResponse }),
      credentials: 'include',
    });

    const verifyData = await verifyRes.json();
    if (!verifyRes.ok || !verifyData.success) {
      throw new Error(verifyData.message || 'Passkey verification failed on server');
    }

    // Persist session
    AuthApi.persistSession(verifyData.data.user, verifyData.data.tokens.accessToken);

    return verifyData.data;
  }
}
