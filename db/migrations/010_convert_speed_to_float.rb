Sequel.migration do
  up do
    alter_table(:lines) do
      set_column_type :speed, Float
    end
  end

  down do
    alter_table(:lines) do
      set_column_type :speed, Integer
    end
  end
end
