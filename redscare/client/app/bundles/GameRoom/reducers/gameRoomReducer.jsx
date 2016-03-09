import Immutable from 'immutable';

import actionTypes from '../constants/gameRoomConstants';

export const $$initialState = Immutable.fromJS({
  name: '', // this is the default state that would be used if one were not passed into the store
});

export default function gameRoomReducer($$state = $$initialState, action) {
  const { type, name } = action;

  switch (type) {
    case actionTypes.GAME_ROOM_NAME_UPDATE_EXAMPLE:
      return $$state.set('name', name);

    default:
      return $$state;
  }
}
