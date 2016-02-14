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

  // listen for new user connections
  // client_connection route in events.rb causes ChatController.client_connection to be invoked,
  // which sends a message 'new_connection'
  dispatcher.bind('new_connection', function(data) {
    var msg = $('<div>' + data.email + ' has connected to the chat</div>');
    $('#chat_room').append(msg);
  });

  // listen for new chat messages
  // corresponds to new_message route in events.rb
  dispatcher.bind('new_message', function(data) {
    var msg = $('<div>' + data.email + ': ' + data.message_body + '</div>');
    $('#chat_room').append(msg);
  });

  // when the user clicks the send message button
  $('#send_button').click(function() {
    dispatcher.trigger('new_message', {
      'message_body': $("#input_box").val()
    });
  });

});