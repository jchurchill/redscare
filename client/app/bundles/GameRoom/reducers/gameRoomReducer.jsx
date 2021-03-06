import { actionTypes, connectionStates } from '../constants/gameRoomConstants';

export const initialState = {
  connectionState: connectionStates.CONNECTING
};

/**
 * This is a reducer, a pure function with (state, action) => state signature.
 * It describes how an action transforms the state into the next state.
 *
 * The shape of the state is up to you: it can be a primitive, an array, an object,
 * or even an Immutable.js data structure. The only important part is that you should
 * not mutate the state object, but return a new object if the state changes.
 */
export default function gameRoomReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.CONNECTION_STATUS_UPDATED:
      return { ...state, connectionState: action.connectionState };

    default:
      return { ...state, game: gameReducer(state.game, action), secrets: secretsReducer(state.secrets, action) };
  }
}

function secretsReducer(state, action) {
  switch (action.type) {
    case actionTypes.STATE_UPDATED:
      // If new secrets present in action, use it; else stick with what we have
      return action.newState.secrets || state;

    default:
      return state;
  }
}

function gameReducer(state, action) {
  switch(action.type) {
    case actionTypes.STATE_UPDATED:
      // If new game state present in action, use it; else stick with what we have
      return action.newState.game || state;

    case actionTypes.JOIN_ROOM:
    case actionTypes.LEAVE_ROOM:
      return { ...state, players: gamePlayersReducer(state.players, action) };

    case actionTypes.START_GAME:
      // Wait for server to say the game has started, since it does the work of
      // updating a bunch of game state that would be a shame to replicate here
      return state;

    case actionTypes.NOMINATE:
    case actionTypes.VOTE:
    case actionTypes.MISSION_SUBMIT:
      return { ...state, rounds: state.rounds.map(r => roundReducer(r, action)) };

    case actionTypes.SELECT_ASSASSIN_TARGET:
      return { ...state, assassinated_player_id: action.targetUserId }

    default:
      return state;
  }
}

function gamePlayersReducer(state, action) {
  switch(action.type) {
    case actionTypes.JOIN_ROOM:
      return [ ...state, { user: action.user.userStateObject } ];

    case actionTypes.LEAVE_ROOM:
      return state.filter((p) => p.user.id !== action.user.id);

    default:
      return state;
  }
}

function roundReducer(state, action) {
  switch(action.type) {
    case actionTypes.NOMINATE:
    case actionTypes.VOTE:
      return { ...state, nominations: state.nominations.map(n => nominationReducer(n, action)) };

    case actionTypes.MISSION_SUBMIT:
      return state.id === action.roundId
        ? { ...state, operatives: state.operatives.map(op => operativeReducer(op, action)) }
        : state;

    default:
      return state;
  }
}

function nominationReducer(state, action) {
  switch(action.type) {
    case actionTypes.NOMINATE:
      return action.nominationId === state.id
        ? { ...state, nominees: nomineesReducer(state.nominees, action) }
        : state;

    case actionTypes.VOTE:
      return action.nominationId === state.id
        ? { ...state, votes: votesReducer(state.votes, action) }
        : state;

    default:
      return state;
  }
}

function nomineesReducer(state, action) {
  switch(action.type) {
    case actionTypes.NOMINATE:
      return [ ...state, action.nomineeUserId ];

    default:
      return state;
  }
}

function votesReducer(state, action) {
  switch(action.type) {
    case actionTypes.VOTE:
      return [ ...state, { upvote: action.upvote, user_id: action.currentUserId } ];

    default:
      return state;
  }
}

function operativeReducer(state, action) {
  switch(action.type) {
    case actionTypes.MISSION_SUBMIT:
      return state.operative_id === action.currentUserId
        ? { ...state, submitted: true }
        : state;

    default:
      return state;
  }
}