/**
 * TOTP (Time-based One-Time Password) Utilities
 * Implements RFC 6238 for 2FA with TOTP
 * 
 * Note: This implementation uses a simplified approach suitable for 2FA.
 * For production use with crypto operations, consider using established libraries.
 */

import crypto from 'crypto';

/**
 * Generate a random secret for TOTP
 * Returns a base32-encoded secret suitable for use with authenticator apps
 */
export function generateTOTPSecret(length: number = 32): string {
  // Generate random bytes
  const randomBytes = crypto.randomBytes(length);
  
  // Convert to base32 (RFC 4648)
  return base32Encode(randomBytes);
}

/**
 * Base32 encoding (RFC 4648)
 */
function base32Encode(buffer: Buffer): string {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let bits = 0;
  let value = 0;
  let output = '';

  for (let i = 0; i < buffer.length; i++) {
    value = (value << 8) | buffer[i];
    bits += 8;
    while (bits >= 5) {
      bits -= 5;
      output += alphabet[(value >> bits) & 31];
    }
  }

  if (bits > 0) {
    output += alphabet[(value << (5 - bits)) & 31];
  }

  return output;
}

/**
 * Base32 decoding (RFC 4648)
 */
function base32Decode(encoded: string): Buffer {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let bits = 0;
  let value = 0;
  const output: number[] = [];

  for (let i = 0; i < encoded.length; i++) {
    const idx = alphabet.indexOf(encoded[i].toUpperCase());
    if (idx === -1) {
      throw new Error(`Invalid base32 character: ${encoded[i]}`);
    }

    value = (value << 5) | idx;
    bits += 5;

    if (bits >= 8) {
      bits -= 8;
      output.push((value >> bits) & 255);
    }
  }

  return Buffer.from(output);
}

/**
 * Generate a TOTP token (6-digit code) from a secret
 */
export function generateTOTPToken(secret: string, time: number = Date.now()): string {
  try {
    const secretBuffer = base32Decode(secret);
    const timeCounter = Math.floor(time / 30000); // 30-second window
    const timeBuffer = Buffer.alloc(8);

    // Write time counter as big-endian 64-bit integer
    for (let i = 7; i >= 0; i--) {
      timeBuffer[i] = timeCounter & 0xff;
      timeCounter >>= 8;
    }

    // HMAC-SHA1
    const hmac = crypto.createHmac('sha1', secretBuffer);
    hmac.update(timeBuffer);
    const digest = hmac.digest();

    // Extract 4-byte value from digest (dynamic truncation)
    const offset = digest[digest.length - 1] & 0x0f;
    const code =
      ((digest[offset] & 0x7f) << 24) |
      ((digest[offset + 1] & 0xff) << 16) |
      ((digest[offset + 2] & 0xff) << 8) |
      (digest[offset + 3] & 0xff);

    // Return 6-digit token
    const token = (code % 1000000).toString().padStart(6, '0');
    return token;
  } catch (error) {
    console.error('[v0] Error generating TOTP token:', error);
    throw new Error('Failed to generate TOTP token');
  }
}

/**
 * Verify a TOTP token against a secret
 * Allows for ±1 time window for clock skew
 */
export function verifyTOTPToken(
  secret: string,
  token: string,
  timeWindow: number = 1,
  time: number = Date.now()
): boolean {
  try {
    // Remove any whitespace
    const cleanToken = token.replace(/\s/g, '');

    // Check if token is 6 digits
    if (!/^\d{6}$/.test(cleanToken)) {
      return false;
    }

    // Check current window and adjacent windows for clock skew
    for (let i = -timeWindow; i <= timeWindow; i++) {
      const checkTime = time + i * 30000;
      const expectedToken = generateTOTPToken(secret, checkTime);

      // Constant-time comparison to prevent timing attacks
      if (constantTimeCompare(cleanToken, expectedToken)) {
        return true;
      }
    }

    return false;
  } catch (error) {
    console.error('[v0] Error verifying TOTP token:', error);
    return false;
  }
}

/**
 * Constant-time string comparison to prevent timing attacks
 */
function constantTimeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return result === 0;
}

/**
 * Generate backup codes for account recovery
 * Returns array of 10 random codes
 */
export function generateBackupCodes(count: number = 10): string[] {
  const codes: string[] = [];

  for (let i = 0; i < count; i++) {
    // Generate 4 random bytes and convert to hex (8 characters)
    const code = crypto.randomBytes(4).toString('hex').toUpperCase();
    codes.push(code);
  }

  return codes;
}

/**
 * Hash a backup code for secure storage
 */
export function hashBackupCode(code: string): string {
  return crypto.createHash('sha256').update(code).digest('hex');
}

/**
 * Verify a backup code against its hash
 */
export function verifyBackupCode(code: string, hash: string): boolean {
  const codeHash = hashBackupCode(code);
  return constantTimeCompare(codeHash, hash);
}

/**
 * Format backup codes for display (groups of 4 characters with dash)
 */
export function formatBackupCode(code: string): string {
  return code.substring(0, 4) + '-' + code.substring(4, 8);
}

/**
 * Generate QR Code URI for TOTP setup
 * This URI can be used by QR code libraries or rendered directly
 * 
 * Format: otpauth://totp/[issuer:]account?secret=[secret]&issuer=[issuer]
 */
export function generateTOTPQRCodeURI(
  secret: string,
  email: string,
  issuer: string = 'Islamic Council'
): string {
  const label = encodeURIComponent(`${issuer}:${email}`);
  const secretParam = encodeURIComponent(secret);
  const issuerParam = encodeURIComponent(issuer);

  return `otpauth://totp/${label}?secret=${secretParam}&issuer=${issuerParam}&algorithm=SHA1&digits=6&period=30`;
}

/**
 * Get remaining seconds in current TOTP window
 */
export function getTOTPTimeRemaining(time: number = Date.now()): number {
  const timeInWindow = (time % 30000) / 1000;
  return Math.ceil(30 - timeInWindow);
}

/**
 * Validate format of TOTP secret
 */
export function isValidTOTPSecret(secret: string): boolean {
  try {
    // Check if it's valid base32
    const alphabet = /^[A-Z2-7]+$/;
    if (!alphabet.test(secret)) {
      return false;
    }

    // Try to decode it
    base32Decode(secret);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate format of TOTP token
 */
export function isValidTOTPToken(token: string): boolean {
  const cleanToken = token.replace(/\s/g, '');
  return /^\d{6}$/.test(cleanToken);
}

/**
 * Validate format of backup code
 */
export function isValidBackupCode(code: string): boolean {
  const cleanCode = code.replace(/[-\s]/g, '');
  return /^[A-F0-9]{8}$/i.test(cleanCode);
}

/**
 * Remove formatting from backup code
 */
export function cleanBackupCode(code: string): string {
  return code.replace(/[-\s]/g, '').toUpperCase();
}
