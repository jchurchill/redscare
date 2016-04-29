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
    const to256Hex = r => Math.floor(r*256).toString(16);
    // consistent random gen based on userId
    const random = seed(this.id),
      r = to256Hex(random()),
      g = to256Hex(random()),
      b = to256Hex(random());
    return '#'+r+g+b;
  }
};
