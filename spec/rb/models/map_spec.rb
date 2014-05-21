require './spec/rb/spec_helper.rb'

describe Map do
  it 'has many lines' do
    type = Map.association_reflections[:lines][:type]
    expect(type).to eq :one_to_many
  end

  it 'whitelists mass-assignable columns' do
    expect(Map.allowed_columns).to eq [:name, :center, :zoom_level, :layover, :hourly_cost]
  end

  describe '.remix' do
    it 'creates a copy of the map and lines' do
      map = create(:map)
      lines = create_list(:line, 3, map_id: map.id)
      copy = Map.first!(id: map.id).remix

      expect(copy.name).to match map.name
      expect(copy.lines.count).to eq 3
    end

    it 'tracks the map that was remixed from' do
      map = create(:map)
      copy = Map.first!(id: map.id).remix

      expect(copy.remixed_from_id).to eq map.id
    end
  end
end
