import { ImageResponse } from 'next/og';
import BrandMark from '@/components/layout/BrandMark';

/** Home-screen icon for iOS — the same mark, full-bleed; iOS applies its own mask. */
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(<BrandMark dimension={180} radius={0} />, size);
}
