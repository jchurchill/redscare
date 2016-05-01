class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  has_many :games, -> { readonly }, through: :game_players

  # all of the below: https://github.com/plataformatec/devise/wiki/How-To%3A-Allow-users-to-sign-in-using-their-username-or-email-address

  # Virtual attribute for authenticating by either username or email
  # This is in addition to a real persisted field like 'username'
  attr_accessor :login

  validates :username,
    :presence => true,
    :uniqueness => {
      :case_sensitive => false
    } # etc.

  # Only allow letter, number, underscore and punctuation.
  validates_format_of :username, with: /^[a-zA-Z0-9_\.]*$/, :multiline => true

  def self.find_for_database_authentication(warden_conditions)
    conditions = warden_conditions.dup
    if login = conditions.delete(:login)
      where(conditions.to_h).where(["username = :value OR email = :value", { :value => login.downcase }]).first
    elsif conditions.has_key?(:username) || conditions.has_key?(:email)
      conditions[:email].downcase! if conditions[:email]
      where(conditions.to_h).first
    end
  end
end