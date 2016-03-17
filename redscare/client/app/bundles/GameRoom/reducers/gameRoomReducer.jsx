import { actionTypes, gameStates } from '../constants/gameRoomConstants';

export const initialState = {
  connected: false
};

/**
 * This is a reducer, a pure function with (state, action) => state signature.
 * It describes how an action transforms the state into the next state.
 *
 * The shape of the state is up to you: it can be a primitive, an array, an object,
 * or even an Immutable.js data structure. The only important part is that you should
 * not mutate the state object, but return a new object if the state changes.
 *
 * In this example, we use a `switch` statement and strings, but you can use a helper that
 * follows a different convention (such as function maps) if it makes sense for your
 * project.
 */
export default function gameRoomReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.CONNECTION_STATUS_UPDATED:
      return { ...state, connected: action.connected };

    case actionTypes.JOIN_ROOM:
    case actionTypes.LEAVE_ROOM:
    case actionTypes.PLAYER_JOINED:
    case actionTypes.PLAYER_LEFT:
      return { ...state, game: gameReducer(state.game, action) };

    default:
      return state;
  }
}

function gameReducer(state, action) {
  switch(action.type) {
    case actionTypes.JOIN_ROOM:
    case actionTypes.LEAVE_ROOM:
    case actionTypes.PLAYER_JOINED:
    case actionTypes.PLAYER_LEFT:
      return { ...state, players: gamePlayersReducer(state.players, action) };

    default:
      return state;
  }
}

function gamePlayersReducer(state, action) {
  switch(action.type) {
    case actionTypes.JOIN_ROOM:
      return [ ...state, { user: action.user } ];

    case actionTypes.LEAVE_ROOM:
      return state.filter((p) => p.user.id !== action.user.id);

    // When other players join, we get the full game player state from the server
    case actionTypes.PLAYER_JOINED:
    case actionTypes.PLAYER_LEFT:
      return action.gamePlayers;

    default:
      return state;
  }
}