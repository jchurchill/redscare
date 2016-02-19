# Be sure to restart your server when you modify this file.

# Version of your assets, change this if you want to expire all your assets.
Rails.application.config.assets.version = '1.0'

# Add additional assets to the asset load path
# Rails.application.config.assets.paths << Emoji.images_path

# Precompile additional assets.
# application.js, application.css, and all non-JS/CSS in app/assets folder are already added.
# Rails.application.config.assets.precompile += %w( search.js )

# Since we removed the require_tree directive in application.js, need to specify precompiled assets here manually.
# I've only done js files for now since there are no css assets yet.
# For more reading, see: http://theflyingdeveloper.com/controller-specific-assets-with-rails-4/
%w(home chat).each do |controller|
  Rails.application.config.assets.precompile += ["#{controller}.js"]
end