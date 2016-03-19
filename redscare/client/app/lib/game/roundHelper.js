import memoize from './memoize';
import Nomination from './nominationHelper';
import User from './userHelper';

// Wraps a round object from the server in a more convenient API
class Round {
  constructor(round) {
    this._round = round;
  }

  get stateObject() {
    return this._round;
  }

  get id() {
    return this._round.id;
  }

  get roundNumber() {
    return this._round.round_number;
  }

  get state() {
    return this._round.state;
  }

  get outcome() {
    return this._round.outcome;
  }

  get nominations() {
    return memoize("nominations", this,
      () => (this._round.nominations || []).map((nom) => new Nomination(nom)));
  }
  
  get operatives() {
    return memoize("operatives", this,
      () => (this._round.operatives || []).map((op) => new User(op.operative)));
  }

  get currentNomination() {
    return memoize("currentNomination", this,
      () => this.nominations.reduce(
        (max, nom) => (!max || nom.nominationNumber > max.nominationNumber) ? nom : max,
        null
      ));
  }

  get currentLeader() {
    return this.currentNomination.leader;
  }
};

Round.states = Object.freeze({
  // Round is in the nomination phase
  NOMINATION: "nomination",
  // Round is in the mission phase
  MISSION: "mission",
  // Round is complete and has an outcome
  COMPLETE: "complete"
});

Round.outcomes = Object.freeze({
  // Round was won for the good guys
  SUCCESS: "success",
  // Round was won for the bad guys
  FAILURE: "failure",
  // Round was won because all nominations were exhausted (ending the game)
  OUT_OF_NOMINATIONS: "out_of_nominations"
});

export default Round;