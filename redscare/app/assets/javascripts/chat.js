$( document ).ready(function() {

  // Setup dispatcher and channel
  var dispatcher = new WebSocketRails('localhost:3000/websocket');

  // When websocket connection succeeds, log it
  dispatcher.on_open = function(data) {
    console.log('Websocket connection established: ', data);
  }
  // When websocket connection terminates, log it
  dispatcher.bind('connection_closed', function(data) {
    console.log('Websocket connection closed: ', data);
  });
  // When websocket connection hits an error, log it
  dispatcher.bind('connection_error', function(data) {
    console.log('Websocket connection error: ', data);
  });

  var displayNewMessage = function(msg) {
    var chat = $('#chat_room');
    chat.append($('<div>' + msg + '</div>'));
    chat.scrollTop(chat[0].scrollHeight);
  };

  // listen for new user connections
  // client_connection route in events.rb causes ChatController.client_connection to be invoked,
  // which sends a message 'new_connection'
  dispatcher.bind('new_connection', function(data) {
    var msg = data.email + ' has connected to the chat';
    displayNewMessage(msg);
  });

  // listen for new chat messages
  // corresponds to new_message route in events.rb
  dispatcher.bind('new_message', function(data) {
    var msg = data.email + ': ' + data.message_body;
    displayNewMessage(msg);
  });

  var sendMessage = function() {
    var textarea = $("#input_box"),
      text = textarea.val();
    if (text.length === 0) {
      return;
    }
    dispatcher.trigger('new_message', {
      'message_body': text
    });
    textarea.val(""); // clear text
    textarea.focus(); // place focus back on textarea
  };

  // when enter is pressed in the textbox (without shift), send message
  $('#input_box').keypress(function(e) {
    if (!e.shiftKey && e.which === 13 /* enter key */) {
      sendMessage();
      e.preventDefault();
    }
  });
});