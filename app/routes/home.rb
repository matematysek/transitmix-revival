module Transitmix
  module Routes
    class Home < Sinatra::Application
      configure do
        set :root, File.expand_path('../../../', __FILE__)
        set :views, 'app/views'
      end

      get '/*' do
        erb :index
      end
    end
  end
end
