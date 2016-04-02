// https://github.com/websocket-rails/websocket-rails/wiki/Using-the-JavaScript-Client

/*

  // Connect a new websocket instance
  import websocket from ...;
  websocket.initialize({
    // host of the app
    host: "localhost:3000",
    // optional function to run when connection opens
    onOpen: (data, websocket) => console.log("connection_id", data.connection_id),
    // optional function to run when connection closes
    onClose: null,
    // optional function to run when connection errors
    onError: null
  });
  var dispatcher = websocket.getDispatcher()
  
  // Send a message
  dispatcher.trigger('comments.create', { title: 'This post was awful', body: 'really awful', post_id: 9 });

  // Listen to messages of a certain type
  dispatcher.bind('comments.new', (comment) => console.log('just received new comment: ' + comment.title));

  // Listen to messages of a certain type, on a specific channel
  dispatcher.subscribe("my_channel")
      .bind('comments.new', (comment) => console.log('just received new comment: ' + comment.title));

  // Unlisten to messages of a certain type
  dispatcher.unbind('comments.new');

*/

// Singleton instance of the websocket object
let websocket = null;

// Setup our singleton instance
const initialize = ({ host, onOpen, onClose, onError }) => {
  websocket = new WebSocketRails(`${host}/websocket`);

  const configure = (func, configure) => {
    if (typeof(func) === 'function') {
      // func accepts (data, websocket), configure curried function accepting just (data)
      configure(websocket, (data) => func(data, websocket));
    }
    else if (func) { console.log('websocket: not a function', func); }
  };

  // Configure open, close, error functions on websocket
  configure(onOpen, (ws, f) => ws.on_open = f);
  configure(onClose, (ws, f) => ws.bind('connection_closed', f));
  configure(onError, (ws, f) => ws.bind('connection_error', f));
};

// Gets the base dispatcher that was initialized.
// Has the full API of websocket-rails (https://github.com/websocket-rails/websocket-rails).
const getDispatcher = () => {
  if (!websocket) {
    // Must call initialize first to setup singleton instance
    throw { message: "Websocket connection not initialized!" }
  }

  return websocket;
}

// Returns a function that will first log arguments to the console,
// then call the failure callback provided (if provided)
const wrapFailure = (failureFunc) => {
  failureFunc = typeof(failureFunc) === 'function' ? failureFunc : () => {}
  return () => {
    console.error("Error on websocket.");
    failureFunc.apply(this, arguments);
  }
};

// Wraps the API of the websocket to reduce confusion around 
// how to communicate on the channel.
const gameClientFactory = (gameId) => {
    const dispatcher = getDispatcher();
    const listener = dispatcher.subscribe(`game_room:${gameId}`);
    
    // Send messages to the server in the context of this game
    const trigger = (eventName, data, success, failure) => {
      // Include game_id in every message to the server
      dispatcher.trigger(eventName, { game_id: gameId, message: data }, success, wrapFailure(failure));
    }
    // Listen to messages from the server on the game's channel
    const bind = (eventName, callback) => {
      listener.bind(eventName, callback);
    }
    // Stop listening to messages from the server on the game's channel
    const unbind = (eventName) => {
      listener.unbind(eventName);
    }

    return { trigger, bind, unbind };
}

export default { initialize, getDispatcher, gameClientFactory }