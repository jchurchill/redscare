import React from 'react';
import { Provider } from 'react-redux';

import createStore from '../store/gameRoomStore';
import GameRoom from '../containers/GameRoom';

// See documentation for https://github.com/reactjs/react-redux.
// This is how you get props from the Rails view into the redux store.
// This code here binds your smart component to the redux store.
export default (props) => {
  const store = createStore(props);
  const reactComponent = (
    <Provider store={store}>
      <GameRoom />
    </Provider>
  );
  return reactComponent;
};

/*
Notes about what's going on here

1. Provider is a very important part of react-redux.
  Wrapping a component in a Provider makes it so that connect calls can wire up the store data to its props - hence no props being passed here.

2. gameRoomStore is where this magic happens.
  gameRoomStore is a function that accepts the props passed to this top-level component from rails,
  and returns a redux store that is initialized as desired.
  This initialization includes:
    - Initializing state from defaults + provided props. Defaults are obtained by combining state sub-tree defaults according to each of the reducers.
    - Applying middleware - interceptors that can intercept action dispatches and do something about them. More here: http://redux.js.org/docs/api/applyMiddleware.html
    - Configure the store's reducer function that takes (state, action) => next state.
      This single function is typically the composition of many reducer functions that operate on subsets of the state tree.

3. GameRoom.jsx is where we end up after that, where we begin rendering our GameRoom component
  It has access to dispatch and $$gameRoomStore thanks to connect.
  
*/