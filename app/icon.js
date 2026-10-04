import { ImageResponse } from 'next/og';
import BrandMark from '@/components/layout/BrandMark';

/** Favicon, generated from the theme so it follows a rebrand. */
export const size = { width: 64, height: 64 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(<BrandMark dimension={64} radius={15} />, size);
}
