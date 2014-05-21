Sequel.migration do
  up do
    alter_table :maps do
      add_column :layover, Float
      add_column :hourly_cost, Integer
    end

    alter_table :lines do
      drop_column :frequency
      drop_column :start_time
      drop_column :end_time
      drop_column :description
      add_column :service_windows, String
    end
  end

  down do
    alter_table :maps do
      drop_column :layover
      drop_column :hourly_cost
    end

    alter_table :lines do
      add_column :frequency, Integer
      add_column :start_time, String
      add_column :end_time, String
      add_column :description, String
      drop_column :service_windows
    end
  end
end
