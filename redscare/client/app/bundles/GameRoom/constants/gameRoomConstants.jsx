// See https://www.npmjs.com/package/mirror-creator
// Allows us to set up constants in a slightly more concise syntax. See:
// client/app/bundles/GameRoom/actions/gameRoomActionCreators.jsx
import mirrorCreator from 'mirror-creator';

const actionTypes = mirrorCreator([
  'GAME_ROOM_NAME_UPDATE_EXAMPLE',
]);

// actionTypes = {GAME_ROOM_NAME_UPDATE_EXAMPLE: "GAME_ROOM_NAME_UPDATE_EXAMPLE"}
// Notice how we don't have to duplicate GAME_ROOM_NAME_UPDATE_EXAMPLE twice
// thanks to mirror-creator.
export default actionTypes;
