module Transitmix
  module Models
    class Map < Sequel::Model
      plugin :timestamps, update_on_create: true
      plugin :json_serializer, :include=>:lines
      plugin :serialization, :json, :center, :service_windows

      set_allowed_columns :name, :center, :zoom_level, :layover, :hourly_cost,
                          :service_windows, :speed, :weekdays_per_year, :saturdays_per_year,
                          :sundays_per_year, :prefer_service_hours, :prefer_metric_units

      one_to_many :lines

      def remix
        new_map = Map.new(allowed_attributes)
        new_map.remixed_from_id = id

        db.transaction do
          new_map.save!
          save!

          lines.each do |line|
            new_map.add_line(line.allowed_attributes)
          end
        end

        new_map
      end
    end
  end
end
