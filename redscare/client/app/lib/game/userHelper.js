import seed from './randomSeed'

// Wraps a user object from the server in a more convenient API
export default class User {
  constructor(user) {
    this._user = user;
  }

  get userStateObject() {
    return this._user;
  }

  get id() {
    return this._user.id;
  }

  get name() {
    return this._user.username;
  }

  get email() {
    return this._user.email;
  }

  get color() {
    // make the color extremely light with a lower bound of 90%
    const lowerBound = 0.9;
    const to256InRange = r => Math.floor((lowerBound + (1 - lowerBound) * r) * 256);
    // consistent random gen based on userId
    const random = seed(this.id),
      r = to256InRange(random()),
      g = to256InRange(random()),
      b = to256InRange(random());
    return `rgb(${r},${g},${b})`;
  }
};
