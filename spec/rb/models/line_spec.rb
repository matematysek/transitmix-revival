require './spec/rb/spec_helper'

describe Line do
  it 'whitelists mass-assignable columns' do
    whitelist = [:coordinates, :name, :speed, :color, :map_id, :service_windows,
                 :weekdays_per_year, :saturdays_per_year, :sundays_per_year,
                 :layover, :hourly_cost]
    expect(Line.allowed_columns).to eq whitelist
  end
end
