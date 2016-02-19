class ChatWebsocketController < WebsocketRails::BaseController
  def initialize_session
    # perform application setup here
  end

  # responds to the automatically existing client_connection message, and the route in events.rb tells it to go here 
  def client_connected
    p 'A client has connected to the websocket'
    broadcast_message :new_connection, { :email => current_user.email }
  end

  # responds to the client's new_message trigger
  def new_message
    p 'A client has sent a message'
    data = event.data
    data[:email] = current_user.email # add current_user's email to the data
    broadcast_message :new_message, data
  end

end