import mirrorCreator from 'mirror-creator';

export const actionTypes = mirrorCreator([
  'CONNECTION_STATUS_UPDATED', // Referring to websocket status
  'JOIN_ROOM', // When user chooses to join
  'LEAVE_ROOM', // When user chooses to leave
  'START_GAME', // When user (as room leader) starts the game
  'PLAYER_JOINED', // When server tells us someone else joined
  'PLAYER_LEFT', // When server tells us someone else left
  'GAME_STARTED', // When server tells us room leader started the game
]);

export const gameStates = Object.freeze({
  // Game is created and looking for players
  CREATED: 1,
  // Game's players and roles finalized; rounds w/ nomination and missions occur; this is the majority of the game
  ROUNDS_IN_PROGRESS: 2,
  // Good guys have 3 passed missions, but assassin / seer are in the game, and assassin is making his decision on who to kill
  ASSASSINATION: 3,
  // The game is over, and the outcome can be seen in the outcome property
  COMPLETE: 4,
  // The game ended before completion because it was cancelled for some reason (e.g., player left)
  CANCELLED: -1
});

export const gameOutcomes = Object.freeze({
  // Good guys get 3 passed missions (and seer is not killed)
  GOOD_WINS_NORMALLY: 1,
  // Bad guys get 3 failed missions
  EVIL_WINS_NORMALLY: 2,
  // Good guys get 3 passed missions, but seer is killed by assassin
  EVIL_WINS_FROM_ASSASSINATION: 3,
  // A round's 5th nomination is rejected, causing the bad guys to instantly win
  EVIL_WINS_FROM_NOMINATION_FAILURE: 4
});

