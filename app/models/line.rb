module Transitmix
  module Models
    class Line < Sequel::Model
      plugin :timestamps, update_on_create: true
      plugin :json_serializer
      plugin :serialization, :json, :coordinates
      plugin :serialization, :json, :service_windows

      set_allowed_columns :coordinates, :name, :speed, :color, :map_id, 
                          :service_windows
    end
  end
end
