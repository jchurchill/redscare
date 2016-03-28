import memoize from './memoize';

// Wraps a nomination object from the server in a more convenient API
class Nomination {
  constructor(nomination, playerProvider) {
    this._nomination = nomination;
    this._playerProvider = playerProvider;
  }

  static state = Object.freeze({
    // The nomination has just begun, but nominees have not yet been selected
    SELECTING: "selecting",
    // The nominees were selected, and are currently being voted on
    VOTING: "voting",
    // The nomination is over because voting has occurred and the outcome recorded
    COMPLETE: "complete"
  });

  static outcome = Object.freeze({
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

  get playerProvider() {
    return this._playerProvider;
  }
};

export default Nomination;