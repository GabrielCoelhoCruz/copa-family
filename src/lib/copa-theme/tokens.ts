/** Design System v1 tokens (Variação C · Estádio) — mirrors CSS vars in src/styles/copa-theme.css */
export const copaTheme = {
  bg: {
    solid: '#243018',
    gradient:
      'radial-gradient(125% 85% at 50% -8%, #4a6443 0%, #34472f 40%, #243018 100%)',
  },
  hero: '#243018',
  card: {
    gradient: 'linear-gradient(180deg, #3a4d34 0%, #2f3d2a 100%)',
    solid: 'rgba(255, 255, 255, 0.07)',
    border: 'rgba(255, 255, 255, 0.14)',
    borderSoft: 'rgba(255, 255, 255, 0.1)',
  },
  gold: '#e6c577',
  goldDeep: '#c9a24e',
  goldGradient:
    'linear-gradient(180deg, #f5e2b8 0%, #e6c577 48%, #c9a24e 100%)',
  green: '#3a5a2c',
  sky: '#56b3f0',
  coral: '#ff6b5e',
  party: '#ffd23f',
  live: '#5fd07f',
  ink: '#1c2411',
  text: '#ffffff',
  muted: 'rgba(255, 255, 255, 0.6)',
  faint: 'rgba(255, 255, 255, 0.38)',
  radius: {
    sm: 12,
    md: 14,
    lg: 16,
    card: 20,
    pill: 30,
  },
} as const

export type CopaTheme = typeof copaTheme
