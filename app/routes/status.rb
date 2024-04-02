module Transitmix
  module Routes
    class Status < RestClient::API
      format :json

      get '/.well-known/status' do
        AppStatus.new
      end
    end
  end
end
