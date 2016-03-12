// https://github.com/websocket-rails/websocket-rails/wiki/Using-the-JavaScript-Client

/*

  // Connect a new websocket instance
  import connectWebsocket from ...;
  var dispatcher = connectWebsocket({
    // root of the app
    root: "localhost:3000",
    // optional function to run when connection opens
    onOpen: (data) => console.log("connection_id", data.connection_id),
    // optional function to run when connection closes
    onClose: null,
    // optional function to run when connection errors
    onError: null
  });
  
  // Send a message
  dispatcher.trigger('comments.create', { title: 'This post was awful', body: 'really awful', post_id: 9 });

  // Listen to messages of a certain type
  dispatcher.bind('comments.new', (comment) => console.log('just received new comment: ' + comment.title));

  // Unlisten to messages of a certain type
  dispatcher.unbind('comments.new');

*/

// Gets a new instance of a websocket
const connectWebsocket = ({ root, onOpen, onClose, onError }) => {
  const websocket = new WebSocketRails(`${root}/websocket`);

  const configure = (func, configure) => {
    if (typeof(func) === 'function') { configure(websocket, func); }
    else if (func) { console.log('websocket: not a function', func); }
  };

  // Configure open, close, error functions on websocket
  configure(onOpen, (ws, f) => ws.on_open = f);
  configure(onClose, (ws, f) => ws.bind('connection_closed', f));
  configure(onError, (ws, f) => ws.bind('connection_error', f));

  return websocket;
};

export default connectWebsocket;