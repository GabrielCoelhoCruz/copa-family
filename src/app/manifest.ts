import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Copa Family',
    short_name: 'Copa Family',
    description:
      'Sala rápida, palpites, Copa Pare no intervalo e ranking com a família.',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#243018',
    theme_color: '#34472f',
    lang: 'pt-BR',
    categories: ['games', 'social'],
    icons: [
      {
        src: '/icon',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/apple-icon',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  }
}
