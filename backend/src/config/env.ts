import dotenv from 'dotenv';

dotenv.config();

export const ENV = {
  PORT: process.env.PORT || '5000',
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
  DATABASE_URL: process.env.DATABASE_URL || '',
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  JWT_SECRET: process.env.JWT_SECRET || 'one_access_secret_key_change_in_production',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'one_refresh_secret_key_change_in_production',
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  JWT_REFRESH_EXPIRES_DAYS: parseInt(process.env.JWT_REFRESH_EXPIRES_DAYS || '30', 10),
  
  // WebAuthn / FIDO2 Passkey config
  RP_NAME: process.env.RP_NAME || 'ONE Financial Assistant',
  RP_ID: process.env.RP_ID || 'localhost',
  ORIGIN: process.env.ORIGIN || 'http://localhost:3000',

  // SMS / OTP Config
  SMS_PROVIDER: process.env.SMS_PROVIDER || 'mock',
  OTP_EXPIRES_MINUTES: parseInt(process.env.OTP_EXPIRES_MINUTES || '5', 10),
  OTP_MAX_ATTEMPTS: parseInt(process.env.OTP_MAX_ATTEMPTS || '3', 10),
  OTP_COOLDOWN_SECONDS: parseInt(process.env.OTP_COOLDOWN_SECONDS || '45', 10),
};
