class ChatController < ApplicationController
  # All methods on this controller require logged-in user;
  # if hitting otherwise, redirect to login page
  before_filter :authenticate_user!

  def chat
	@javascripts << "chat"
  end
end
