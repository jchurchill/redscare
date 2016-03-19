import { actionTypes, connectionStates } from '../constants/gameRoomConstants';
import Game from 'lib/game/gameHelper';

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
 *
 * In this example, we use a `switch` statement and strings, but you can use a helper that
 * follows a different convention (such as function maps) if it makes sense for your
 * project.
 */
export default function gameRoomReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.CONNECTION_STATUS_UPDATED:
      return { ...state, connectionState: action.connectionState };

    case actionTypes.JOIN_ROOM:
    case actionTypes.LEAVE_ROOM:
    case actionTypes.PLAYER_JOINED:
    case actionTypes.PLAYER_LEFT:
    case actionTypes.START_GAME:
    case actionTypes.GAME_STARTED:
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

    case actionTypes.START_GAME:
      return { ...state, state: Game.states.ROUNDS_IN_PROGRESS };

    case actionTypes.GAME_STARTED:
      // Entire game state is received from the server
      return action.gameState;

    default:
      return state;
  }
}

function gamePlayersReducer(state, action) {
  switch(action.type) {
    case actionTypes.JOIN_ROOM:
      return [ ...state, { user: action.user.stateObject } ];

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