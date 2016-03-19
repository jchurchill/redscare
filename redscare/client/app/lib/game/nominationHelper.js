import memoize from './memoize';
import User from './userHelper';

// Wraps a nomination object from the server in a more convenient API
class Nomination {
  constructor(nomination) {
    this._nomination = nomination;
  }

  get stateObject() {
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
    return memoize("leader", this,
      () => new User(this._nomination.leader));
  }

  get votes() {
    return memoize("votes", this, 
      () => this._nomination.votes.map(
        (v) => ({ upvote: v.upvote, user: new User(v.user) })
      ));
  }
};

Nomination.state = Object.freeze({
  // The nomination has just begun, but nominees have not yet been selected
  SELECTING: "selecting",
  // The nominees were selected, and are currently being voted on
  VOTING: "voting",
  // The nomination is over because voting has occurred and the outcome recorded
  COMPLETE: "complete"
});

Nomination.outcome = Object.freeze({
  // A majority of players upvoted the nomination, so it was accepted
  ACCEPTED: "accepted",
  // A majority of players did not upvote the nomination, so it was rejected
  REJECTED: "rejected"
});

export default Nomination;