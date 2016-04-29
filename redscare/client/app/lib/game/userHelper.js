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
};
