import mirrorCreator from 'mirror-creator';

export const actionTypes = mirrorCreator([
  'CONNECTION_STATUS_UPDATED', // Referring to websocket status

  'JOIN_ROOM', // When user chooses to join
  'LEAVE_ROOM', // When user chooses to leave
  'START_GAME', // When user (as room leader) starts the game
  'PLAYER_JOINED', // When server tells us someone else joined
  'PLAYER_LEFT', // When server tells us someone else left
  'GAME_STARTED', // When server tells us room leader started the game

  //'',
]);

export const connectionStates = mirrorCreator([
  'CONNECTING',
  'CONNECTED',
  'DISCONNECTED'
]);

export const gameStates = Object.freeze({
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

export const gameOutcomes = Object.freeze({
  // Good guys get 3 passed missions (and seer is not killed)
  GOOD_WINS_NORMALLY: "good_wins_normally",
  // Bad guys get 3 failed missions
  EVIL_WINS_NORMALLY: "evil_wins_normally",
  // Good guys get 3 passed missions, but seer is killed by assassin
  EVIL_WINS_FROM_ASSASSINATION: "evil_wins_from_assassination",
  // A round's 5th nomination is rejected, causing the bad guys to instantly win
  EVIL_WINS_FROM_NOMINATION_FAILURE: "evil_wins_from_nomination_failure"
});

export const roundStates = Object.freeze({
  // Round is in the nomination phase
  NOMINATION: "nomination",
  // Round is in the mission phase
  MISSION: "mission",
  // Round is complete and has an outcome
  COMPLETE: "complete"
});

export const roundOutcomes = Object.freeze({
  // Round was won for the good guys
  SUCCESS: "success",
  // Round was won for the bad guys
  FAILURE: "failure",
  // Round was won because all nominations were exhausted (ending the game)
  OUT_OF_NOMINATIONS: "out_of_nominations"
});