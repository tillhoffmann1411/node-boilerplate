export interface JwtClaimSet {
  _id: string,
  name: string,
  email: string,
}

export interface JwtTokenObject {
  token: string,
  expiresIn: number,
}