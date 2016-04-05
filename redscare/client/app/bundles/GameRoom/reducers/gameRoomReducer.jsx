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

    default:
      return { ...state, game: gameReducer(state.game, action), secrets: secretsReducer(state.secrets, action) };
  }
}

function secretsReducer(state, action) {
  switch (action.type) {
    case actionTypes.GAME_STARTED:
      // New secrets come from server
      return action.newState.secrets;

    default:
      return state;
  }
}

function gameReducer(state, action) {
  switch(action.type) {
    case actionTypes.NOMINATE:
    case actionTypes.VOTE:
      return { ...state, rounds: state.rounds.map(r => roundReducer(r, action)) };

    case actionTypes.JOIN_ROOM:
    case actionTypes.LEAVE_ROOM:
      return { ...state, players: gamePlayersReducer(state.players, action) };

    case actionTypes.START_GAME:
      // Wait for server to say the game has started, since it does the work of
      // updating a bunch of game state that would be a shame to replicate here
      return state;

    case actionTypes.PLAYER_JOINED:
    case actionTypes.PLAYER_LEFT:
    case actionTypes.PLAYER_NOMINATED:
    case actionTypes.PLAYER_VOTED:
    case actionTypes.GAME_STARTED:
    case actionTypes.NEW_ROUND:
    case actionTypes.NEW_NOMINATION:
      // Entire game state is received from the server
      return action.newState.game;

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