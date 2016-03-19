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
    // This is all we have right now, need to get better login
    return this._user.email;
  }
};
