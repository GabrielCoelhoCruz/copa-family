export const routes = {
  home: '/',
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
} as const
