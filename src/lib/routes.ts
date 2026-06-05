export const routes = {
  home: '/',
  designSystem: '/design-system',
  calendario: '/calendario',
  calendarioComSala: (roomCode: string) =>
    `/calendario?sala=${encodeURIComponent(roomCode.toUpperCase())}`,
  criarSala: '/criar-sala',
  entrar: '/entrar',
  entrarComCodigo: (roomCode: string) =>
    `/entrar?code=${encodeURIComponent(roomCode.toUpperCase())}`,
  sala: (roomCode: string) => `/sala/${roomCode}`,
  palpites: (roomCode: string) => `/sala/${roomCode}/palpites`,
  ranking: (roomCode: string) => `/sala/${roomCode}/ranking`,
  copaPare: (roomCode: string) => `/sala/${roomCode}/copa-pare`,
  perfil: (roomCode: string) => `/sala/${roomCode}/perfil`,
  adminMetricas: '/admin/metricas',
  adminCatalogo: '/admin/catalogo',
  criarSalaComFixture: (fixtureId: string) =>
    `/criar-sala?fixture=${encodeURIComponent(fixtureId)}`,
} as const
