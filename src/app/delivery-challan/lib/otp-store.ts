const otpStore = new Map<string, { otp: string; expiresAt: number }>();

export function setOTP(email: string, otp: string) {
  const expiresAt = Date.now() + 5 * 60 * 1000;
  otpStore.set(email.toLowerCase(), { otp, expiresAt });
  for (const [key, value] of otpStore.entries()) {
    if (value.expiresAt < Date.now()) otpStore.delete(key);
  }
}

export function verifyOTP(email: string, otp: string): boolean {
  const stored = otpStore.get(email.toLowerCase());
  if (!stored) return false;
  if (stored.expiresAt < Date.now()) {
    otpStore.delete(email.toLowerCase());
    return false;
  }
  if (stored.otp !== otp) return false;
  otpStore.delete(email.toLowerCase());
  return true;
}
