export interface IJwtClaimSet {
  _id: string,
  name: string,
  email: string,
}

export interface IJwtTokenObject {
  token: string,
  expires: number,
}

export interface IRefreshToken {
  token: string,
  createdByIp: string,
  expires: number,
  created: number,
}