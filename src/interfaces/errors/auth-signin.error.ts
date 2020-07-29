export class AuthSigninError extends Error {
  msg: string
  
  constructor(msg: string) {
    super(msg);
    this.msg = msg;

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = AuthSigninError.name;
  }

  simplify(): string {
    return 'Error by signin: ' + this.msg;
  }

  toString(): string {
    return this.msg;
  }

}