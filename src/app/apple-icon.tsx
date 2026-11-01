import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    <div style={{ display: 'flex', width: '100%', height: '100%' }}>
      <svg width="180" height="180" viewBox="0 0 64 64">
        <rect width="64" height="64" fill="#2B35F0" />
        <path
          d="M12 20h40v8a4 4 0 0 0 0 8v8H12v-8a4 4 0 0 0 0-8z"
          fill="#FFFFFF"
        />
        <path
          d="M40 22v20"
          stroke="#2B35F0"
          strokeWidth="2.5"
          strokeDasharray="3 3"
          strokeLinecap="round"
        />
      </svg>
    </div>,
    size,
  );
}
