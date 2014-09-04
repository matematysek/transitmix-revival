require 'bundler'
Bundler.require

# setup environment variables
require 'dotenv'
Dotenv.load

# setup load paths
$: << File.expand_path('../', __FILE__)
$: << File.expand_path('../lib', __FILE__)

require 'sinatra/base'
require 'sinatra-sequel'
require 'sinatra-assets'
require 'grape'

require 'app/routes'

module Transitmix
  class App < Sinatra::Application
    set :root, File.expand_path('../', __FILE__)

    configure :production do
      require 'newrelic_rpm'
      require 'sinatra-error-logging'
    end
  end
end

require 'app/models'
include Transitmix::Models
