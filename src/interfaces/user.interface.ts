export interface IUser {
  _id?: string,
  name: string,
  email: string,
  password?: string,
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface User {
      _id: string;
      name: string;
      email: string;
    }
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
export function typeOfUser(obj: any): boolean {
  const emailReg = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  return (obj.name && typeof obj.name === 'string') &&
    (obj.email && typeof obj.email === 'string' && emailReg.test(obj.email)) &&
    (obj.password && typeof obj.password === 'string');
}