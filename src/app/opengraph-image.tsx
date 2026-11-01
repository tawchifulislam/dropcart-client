import { ImageResponse } from 'next/og';

export const alt = 'DropCart, limited drops with every unit counted';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const CELLS = Array.from({ length: 12 }, (_, index) => index);

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: '#0D0F26',
        color: '#ECEEFF',
        padding: 72,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <svg width="72" height="72" viewBox="0 0 64 64">
          <rect width="64" height="64" rx="14" fill="#2B35F0" />
          <path
            d="M12 20h40v8a4 4 0 0 0 0 8v8H12v-8a4 4 0 0 0 0-8z"
            fill="#FFFFFF"
          />
        </svg>
        <div style={{ marginLeft: 20, fontSize: 56, fontWeight: 800 }}>
          DropCart
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 96, fontWeight: 800, lineHeight: 1.05 }}>
          Limited drops.
        </div>
        <div
          style={{
            fontSize: 96,
            fontWeight: 800,
            lineHeight: 1.05,
            color: '#8089FF',
          }}
        >
          Every unit counted.
        </div>
      </div>
      <div style={{ display: 'flex' }}>
        {CELLS.map((index) => (
          <div
            key={index}
            style={{
              width: 60,
              height: 22,
              marginRight: 10,
              borderRadius: 4,
              background: index < 8 ? '#8089FF' : 'transparent',
              border: index < 8 ? '3px solid #8089FF' : '3px solid #4B51A0',
            }}
          />
        ))}
      </div>
    </div>,
    size,
  );
}
