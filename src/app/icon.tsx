import { ImageResponse } from 'next/og'

export const size = { width: 512, height: 512 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(145deg, #1f7a4a 0%, #0f4d2e 55%, #f5c518 100%)',
          borderRadius: 96,
        }}
      >
        <div
          style={{
            fontSize: 220,
            fontWeight: 900,
            color: '#fff',
            letterSpacing: -8,
          }}
        >
          CF
        </div>
      </div>
    ),
    { ...size }
  )
}
