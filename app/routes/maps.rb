module Transitmix
  module Routes
    class Maps < Grape::API
      version 'v1', using: :header, vendor: 'transitmix'
      format :json

      rescue_from Sequel::NoMatchingRow do
        Rack::Response.new({}, 404)
      end

      params do
        requires :id, type: Integer
      end

      post '/api/maps/:id/remix' do
        Map.first!(id: params[:id]).remix
      end

      params do
        requires :id, type: Integer
      end

      get '/api/maps/:id' do
        Map.first!(id: params[:id])
      end

      params do
        optional :page, type: Integer, default: 1
        optional :per, type: Integer, default: 10, max: 100
      end

      get '/api/maps' do
        Map.dataset.paginate(params[:page], params[:per]).order(Sequel.desc(:created_at))
      end

      params do
        requires :name, type: String
        optional :center, type: Array
        optional :zoom_level, type: String
        optional :layover, type: Float
        optional :hourly_cost, type: Integer
      end

      post '/api/maps' do
        Map.create(params)
      end

      params do
        requires :id, type: Integer
      end

      put '/api/maps/:id' do
        Map.first!(id: params[:id]).update(params)
      end
    end
  end
end
