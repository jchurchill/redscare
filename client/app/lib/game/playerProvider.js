import memoize from './memoize';
import User from './userHelper';

// Translates userId => (user object) for players in a game
export default class PlayerProvider {
  constructor(game) {
    this._players = game.players;
    this._playerCount = game.player_count;
  }

  get players() {
    return memoize("players", this,
      () => this._players.map((pl) => new User(pl.user)));
  }

  get playerCount() {
    return this._playerCount;
  }

  getPlayerById(userId) {
    const lookup = memoize("getPlayerById", this,
      () => this.players.reduce((ps, p) => { ps[p.id] = p; return ps; }, {}))
    return lookup[userId];
  }
}