import { compose, createStore, applyMiddleware, combineReducers } from 'redux';
import Game from 'lib/game/gameHelper';
import User from 'lib/game/userHelper';

// See
// https://github.com/gaearon/redux-thunk and http://redux.js.org/docs/advanced/AsyncActions.html
// This is not actually used for this simple example, but you'd probably want to use this
// once your app has asynchronous actions.
import thunkMiddleware from 'redux-thunk';

// This provides an example of logging redux actions to the console.
// You'd want to disable this for production.
import loggerMiddleware from 'lib/middlewares/loggerMiddleware';

import reducers from '../reducers';
import { initialStates } from '../reducers';

export default props => {
  const { gameRoomState } = initialStates;
  const initialState = {
    gameRoomStore: { ...gameRoomState, ...props },
  };

  const reducer = combineReducers(reducers);
  const composedStore = compose(
    applyMiddleware(thunkMiddleware, loggerMiddleware)
  );
  const storeCreator = composedStore(createStore);
  const store = storeCreator(reducer, initialState);

  return store;
};
