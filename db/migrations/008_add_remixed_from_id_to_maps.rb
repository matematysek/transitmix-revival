Sequel.migration do
  up do
    alter_table :maps do
      add_column :remixed_from_id, Integer
    end
  end

  down do
    alter_table :maps do
      drop_column :remixed_from_id
    end
  end
end
