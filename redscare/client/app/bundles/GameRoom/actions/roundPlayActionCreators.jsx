import { actionTypes } from '../constants/gameRoomConstants';

export function nominate(user) {
  return {
    type: actionTypes.NOMINATE,
    user
  };
}