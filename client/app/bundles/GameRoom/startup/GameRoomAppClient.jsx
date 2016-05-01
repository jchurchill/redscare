import React from 'react';
import { Provider } from 'react-redux';

import createStore from '../store/gameRoomStore';
import GameRoomContainer from '../containers/GameRoomContainer';

// See documentation for https://github.com/reactjs/react-redux.
// This is how you get props from the Rails view into the redux store.
// This code here binds your smart component to the redux store.
export default (props) => {
  const { component_props, store_props } = props;
  // Props from the server: "store_props" goes to the store,
  // "component_props" goes to the root container
  const store = createStore(store_props);
  const reactComponent = (
    <Provider store={store}>
      <GameRoomContainer { ...component_props } />
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

4. From here on out, anything can have access to the store and the dispatcher as long as it connects.
  This is because GameRoom is the root component of all other components, so everything is ultimately under it, and therefore within the Provider defined here,
  which allows connect to work (as explained in (1)).
  The pattern that we should see is that when "smart" components care about some part of global store state, they connect to the store, and in
  their mapStateToProps function, they select out the section of it that is relevant to them.
  Same for mapDispatchToProps - they should be binding action creators for the actions that are relevant to them.

*/