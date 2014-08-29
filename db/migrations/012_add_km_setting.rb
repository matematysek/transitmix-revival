Sequel.migration do
  up do
    alter_table :maps do
      add_column :prefer_metric_units, TrueClass, default: false
    end
  end

  down do
    alter_table :maps do
      drop_column :prefer_metric_units
    end
  end
end
