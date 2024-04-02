module Transitmix
  module Routes
    class Maps < RestClient::API
      version 'v1', using: :header, vendor: 'transitmix'
      format :json
      content_type :zip, 'application/octet-stream'
      content_type :kml, 'application/vnd.google-earth.kml+xml'

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

      get '/api/maps/:id.zip' do
        map = Map.first!(id: params[:id])
        Shapefile.new(map).call
      end

      get '/api/maps/:id.kml' do
        map = Map.first!(id: params[:id])
        KMLExport.new(map).call
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
        optional :service_windows, type: Array
        optional :speed, type: Float
        optional :weekdays_per_year, type: Integer
        optional :saturdays_per_year, type: Integer
        optional :sundays_per_year, type: Integer
        # optional :prefer_service_hours, type: TrueClass
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
