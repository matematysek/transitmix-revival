require 'airbrake'

Airbrake.configure do |config|
  config.api_key = ENV['ERROR_LOG_KEY']
  config.host    = ENV['ERROR_LOG_HOST']
  config.port    = 443
  config.secure  = true
end
