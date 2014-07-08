Sequel.migration do
  up do
    alter_table :maps do
      add_column :service_windows, String
      add_column :speed, Float
      add_column :weekdays_per_year, Integer, default: 255
      add_column :saturdays_per_year, Integer, default: 55
      add_column :sundays_per_year, Integer, default: 55
      add_column :prefer_service_hours, TrueClass
    end

    alter_table :lines do
      add_column :layover, Float
      add_column :hourly_cost, Integer
      add_column :weekdays_per_year, Integer, default: 255
      add_column :saturdays_per_year, Integer, default: 55
      add_column :sundays_per_year, Integer, default: 55
    end
  end

  down do
    alter_table :maps do
      drop_column :service_windows
      drop_column :speed
      drop_column :weekdays_per_year
      drop_column :saturdays_per_year
      drop_column :sundays_per_year
      drop_column :prefer_service_hours
    end

    alter_table :lines do
      drop_column :layover
      add_column :hourly_cost
      drop_column :weekdays_per_year
      drop_column :saturdays_per_year
      drop_column :sundays_per_year
    end
  end
end
