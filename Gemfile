source 'https://rubygems.org'


# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'rails', '4.2.5.1'

# Use sqlite3 as the database for Active Record
# Heroku requires postgres, so use that in production
group :production do
  gem "pg"
end
group :development, :test do
  gem "sqlite3", "~> 1.3.0"
end

# Use SCSS for stylesheets
gem 'sass-rails', '~> 5.0'
# Allow usage of coffeescript in asset pipepline
gem 'coffee-rails', '~> 4.1.0'
# Use Uglifier as compressor for JavaScript assets
gem 'uglifier', '>= 1.3.0'
# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
gem 'jbuilder', '~> 2.0'
# bundle exec rake doc:rails generates the API under doc/api.
gem 'sdoc', '~> 0.4.0', group: :doc

# JC user authentication gem
# https://github.com/plataformatec/devise
gem 'devise', '4.0.1'

# JC websockets gem
# http://websocket-rails.github.io/
gem 'faye-websocket', '0.10.0' # faye-websocket 0.10.2 has issues, use 0.10.0
gem 'websocket-rails'

# Use ActiveModel has_secure_password
# gem 'bcrypt', '~> 3.1.7'

# Use Unicorn as the app server
# gem 'unicorn'

# Use Capistrano for deployment
# gem 'capistrano-rails', group: :development

group :development, :test do
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem 'byebug'
end

group :development do
  # Access an IRB console on exception pages or by using <%= console %> in views
  gem 'web-console', '~> 2.0'
end

# For heroku deployment
gem 'rails_12factor', group: :production

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]

# JJ React on Rails gem (sets up react, webpack, babel, redux, and react-router)
gem "react_on_rails", "~> 3"
