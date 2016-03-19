import memoize from './memoize';
import Round from './roundHelper';
import User from './userHelper';
import * as gameRules from './gameRules';

// Wraps a game from the server in a more convenient API
class Game {
  constructor(game, secrets) {
    this._game = game;
    this._secrets = secrets;
  }

  get gameStateObject() {
    return this._game;
  }

  get secretsStateObject() {
    return this._secrets;
  }

  get id() {
    return this._game.id;
  }

  get name() {
    return this._game.name;
  }

  get playerCount() {
    return this._game.player_count;
  }

  get creatorId() {
    return this._game.creator_id;
  }

  get state() {
    return this._game.state;
  }

  get outcome() {
    return this._game.outcome;
  }

  get specialRules() {
    return memoize("specialRules", this,
      () => ({
        includesSeer: this._game.includes_seer,
        includesSeerDeception: this._game.includes_seer_deception,
        includesRogueEvil: this._game.includes_rogue_evil,
        includesEvilMaster: this._game.includes_evil_master
      }));
  }

  get players() {
    return memoize("players", this,
      () => this._game.players.map((pl) => new User(pl.user)));
  }

  get rounds() {
    return memoize("rounds", this,
      () => (this._game.rounds || []).map((r) => new Round(r)));
  }

  get currentRound() {
    return memoize("currentRound", this,
      () => this.rounds.reduce(
        (max, round) => (!max || round.roundNumber > max.roundNumber) ? round : max,
        null
      ));
  }

  get currentRoundLeader() {
    if (!this.currentRound) { return null; }
    return this.getPlayerById(this.currentRound.currentLeaderId);
  }

  get assassinatedPlayer() {
    return memoize("assassinatedPlayer", this,
      () => this._game.assassinated_player && new User(this._game.assassinated_player));
  }

  get evilRoleCount() {
    return memoize("evilRoleCount", this,
      () => gameRules.getEvilRoleCount(this.playerCount));
  }

  get currentUserIsEvil() {
    return this._secrets && gameRules.isRoleEvil(this._secrets.role);
  }

  get roleSecrets() {
    return this._secrets.role_info;
  }

  getPlayerById(userId) {
    const lookup = memoize("getPlayerById", this,
      () => this.players.reduce((ps, p) => { ps[p.id] = p; return ps; }, {}))
    return lookup[userId];
  }
};

Game.roles = Object.freeze(
  Object.keys(gameRules.roles).reduce((rs, r) => {
    rs[r] = gameRules.roles[r].name; return rs;
  }, {})
);

Game.states = Object.freeze({
  // Game is created and looking for players
  CREATED: "created",
  // Game's players and roles finalized; rounds w/ nomination and missions occur; this is the majority of the game
  ROUNDS_IN_PROGRESS: "rounds_in_progress",
  // Good guys have 3 passed missions, but assassin / seer are in the game, and assassin is making his decision on who to kill
  ASSASSINATION: "assassination",
  // The game is over, and the outcome can be seen in the outcome property
  COMPLETE: "complete",
  // The game ended before completion because it was cancelled for some reason (e.g., player left)
  CANCELLED: "cancelled"
});

Game.outcomes = Object.freeze({
  // Good guys get 3 passed missions (and seer is not killed)
  GOOD_WINS_NORMALLY: "good_wins_normally",
  // Bad guys get 3 failed missions
  EVIL_WINS_NORMALLY: "evil_wins_normally",
  // Good guys get 3 passed missions, but seer is killed by assassin
  EVIL_WINS_FROM_ASSASSINATION: "evil_wins_from_assassination",
  // A round's 5th nomination is rejected, causing the bad guys to instantly win
  EVIL_WINS_FROM_NOMINATION_FAILURE: "evil_wins_from_nomination_failure"
});

export default Game;