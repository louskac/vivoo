import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ViVoo Event Experience',
    short_name: 'ViVoo',
    description: 'Immersive event discovery and zero-friction ticket checkout.',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait-primary',
    background_color: '#09090d',
    theme_color: '#ff2a54',
    icons: [
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  }
}
