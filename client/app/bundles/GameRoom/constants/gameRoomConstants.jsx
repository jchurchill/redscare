import mirrorCreator from 'mirror-creator';

export const actionTypes = mirrorCreator([
  'CONNECTION_STATUS_UPDATED', // Referring to websocket status

  'JOIN_ROOM', // When user chooses to join
  'LEAVE_ROOM', // When user chooses to leave
  'START_GAME', // When user (as room leader) starts the game
  'PLAYER_JOINED', // When server tells us someone else joined
  'PLAYER_LEFT', // When server tells us someone else left

  'STATE_UPDATED', // When server sends us the full game state after another player takes an action

  'NOMINATE', // When user (as round leader) nominates a player
  'VOTE', // When user upvotes or downvotes a nomination
  'MISSION_SUBMIT', // When user operative submits pass / fail for a round
  'SELECT_ASSASSIN_TARGET', // When assassin selects target to kill
]);

export const connectionStates = mirrorCreator([
  'CONNECTING',
  'CONNECTED',
  'DISCONNECTED'
]);

export const eventNamespace = "game_room";

export const serverEvents = [
  'player_joined',
  'player_left',
  'game_started',
  'new_round',
  'new_nomination',
  'player_nominated',
  'voting_started',
  'vote_cast',
  'nomination_completed',
  'mission_started',
  'submission_cast',
  'round_completed',
  'assassination_begun',
  'assassin_target_selected',
  'game_completed'
];