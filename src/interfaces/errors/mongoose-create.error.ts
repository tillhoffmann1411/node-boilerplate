export class MongooseCreateError extends Error {
  msg: string
  
  constructor(msg: string) {
    super(msg);
    this.msg = msg;

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = MongooseCreateError.name;
  }

  simplify(): string {
    return 'Error by adding new DB entry';
  }

  toString(): string {
    return this.msg;
  }

}