// This file is our manifest of all reducers for the app.
// See also /client/app/bundles/GameRoom/store/gameRoomStore.jsx
// A real world app will likely have many reducers and it helps to organize them in one file.
import gameRoomReducer from './gameRoomReducer';
import { initialState as gameRoomState } from './gameRoomReducer';

export default {
  gameRoomStore: gameRoomReducer,
};

export const initialStates = {
  gameRoomState,
};
