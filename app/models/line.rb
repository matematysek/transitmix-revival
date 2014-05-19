class Line < Sequel::Model
  plugin :timestamps, update_on_create: true
  plugin :json_serializer
  plugin :serialization, :json, :coordinates

  set_allowed_columns :coordinates, :name, :description, :start_time,
                      :end_time, :frequency, :speed, :color, :map_id
end
