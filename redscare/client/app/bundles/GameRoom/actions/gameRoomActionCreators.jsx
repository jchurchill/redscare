import actionTypes from '../constants/gameRoomConstants';

export function updateName(name) {
  return {
    type: actionTypes.GAME_ROOM_NAME_UPDATE_EXAMPLE,
    name,
  };
}
