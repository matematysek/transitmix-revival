module Transitmix
  module Models
    class Line < Sequel::Model
      plugin :timestamps, update_on_create: true
      plugin :json_serializer
      plugin :serialization, :json, :coordinates
      plugin :serialization, :json, :service_windows

      set_allowed_columns :coordinates, :name, :speed, :color, :map_id, 
                          :service_windows, :weekdays_per_year, :saturdays_per_year,
                          :sundays_per_year, :layover, :hourly_cost

      # Used in a variety of export formats
      def to_flattened_lnglat
        coordinates.flatten(1).map { |latlng| latlng.reverse }
      end
    end
  end
end
