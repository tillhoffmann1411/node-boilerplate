interface IJwtConfig {
  expiresIn: number;  // in seconds
  refreshTokenExpiresIn: number // in seconds
}

export const JWT_CONFIG: IJwtConfig = {
  expiresIn: 300,   // 5 minutes
  refreshTokenExpiresIn: 604800,  // 7 Days
}