const PLATFORM_FEE_RATE = 0.1;

export function calculateDevPayout(bounty: number): number {
  return Math.round(bounty * (1 - PLATFORM_FEE_RATE));
}

export function getPlatformFee(bounty: number): number {
  return Math.round(bounty * PLATFORM_FEE_RATE);
}

export const PLATFORM_FEE_PERCENT = PLATFORM_FEE_RATE * 100;