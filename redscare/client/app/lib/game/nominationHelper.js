import memoize from './memoize';

// Wraps a nomination object from the server in a more convenient API
class Nomination {
  constructor(nomination, round) {
    this._nomination = nomination; // raw server data
    this._round = round; // instanceof(Round) containing this nomination
  }

  static states = Object.freeze({
    // The nomination has just begun, but nominees have not yet been selected
    SELECTING: "selecting",
    // The nominees were selected, and are currently being voted on
    VOTING: "voting",
    // The nomination is over because voting has occurred and the outcome recorded
    COMPLETE: "complete"
  });

  static outcomes = Object.freeze({
    // A majority of players upvoted the nomination, so it was accepted
    ACCEPTED: "accepted",
    // A majority of players did not upvote the nomination, so it was rejected
    REJECTED: "rejected"
  });

  get nominationStateObject() {
    return this._nomination;
  }

  get id() {
    return this._nomination.id;
  }

  get nominationNumber() {
    return this._nomination.nomination_number;
  }

  get state() {
    return this._nomination.state;
  }
  
  get outcome() {
    return this._nomination.outcome; 
  }

  get leader() {
    return this._playerProvider.getPlayerById(this._nomination.leader_id);
  }

  get nominees() {
    return memoize("nominees", this,
      () => this._nomination.nominees.map(
        nom => this._playerProvider.getPlayerById(nom.user_id)
      ));
  }

  get votes() {
    return memoize("votes", this, 
      () => this._nomination.votes.map(
        v => ({ upvote: v.upvote, userId: v.user_id })
      ));
  }

  get requiredNomineeCount() {
    return this._round.missionInfo.operativeCount;
  }

  get _playerProvider() {
    return this._round.playerProvider;
  }
};

export default Nomination;