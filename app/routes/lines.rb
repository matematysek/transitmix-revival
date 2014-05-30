module Transitmix
  module Routes
    class Lines < Grape::API
      version 'v1', using: :header, vendor: 'transitmix'
      format :json

      rescue_from Sequel::NoMatchingRow do
        Rack::Response.new({}, 404)
      end

      params do
        requires :id, type: Integer
      end

      get '/api/lines/:id' do
        Line.first!(id: params[:id])
      end

      params do
        optional :page, type: Integer, default: 1
        optional :per, type: Integer, default: 10, max: 100
      end

      get '/api/lines' do
        Line.dataset.paginate(params[:page], params[:per]).order(Sequel.desc(:created_at))
      end

      params do
        requires :name, type: String
        requires :coordinates, type: Array
        optional :speed, type: Integer
        optional :color, type: String
        optional :service_windows, type: Array
      end

      post '/api/lines' do
        Line.create(params)
      end

      params do
        requires :id, type: Integer
      end

      put '/api/lines/:id' do
        Line.first!(id: params[:id]).update(params)
      end

      params do
        requires :id, type: Integer
      end

      delete '/api/lines/:id' do
        Line.first!(id: params[:id]).destroy
      end
    end
  end
end
