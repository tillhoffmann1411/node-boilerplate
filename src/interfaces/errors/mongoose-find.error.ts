export class MongooseFindError extends Error {
  msg: string
  
  constructor(msg: string) {
    super(msg);
    this.msg = msg;

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = MongooseFindError.name;
  }

  simplify(): string {
    return 'Error by finding a DB entry';
  }

  toString(): string {
    return this.msg;
  }

}