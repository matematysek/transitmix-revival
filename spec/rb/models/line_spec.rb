require './spec/rb/spec_helper'

describe Line do
  it 'whitelists mass-assignable columns' do
    whitelist = [:coordinates, :name, :description, :start_time,
                 :end_time, :frequency, :speed, :color, :map_id]
    expect(Line.allowed_columns).to eq whitelist
  end
end
