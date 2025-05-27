import crypto from 'crypto';

export function hmacHash(payload: string): string {
  return crypto.createHmac('sha256', payload).digest('hex');
}
