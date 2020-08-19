interface IJwtConfig {
  expiresIn: number;  // in seconds
  refreshTokenexpiresIn: number // in seconds
}

export const JWT_CONFIG: IJwtConfig = {
  expiresIn: 300,   // 5 minutes
  refreshTokenexpiresIn: 604800,  // 7 Days
}