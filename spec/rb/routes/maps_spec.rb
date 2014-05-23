require './spec/rb/spec_helper.rb'

describe Transitmix::Routes::Maps do
  include Transitmix::Routes::TestHelpers

  describe 'POST /api/maps/:id/remix' do
    let!(:map) { create(:map) }
    let!(:lines) { create_list(:line, 3, map_id: map.id) }

    it 'responds with 201 CREATED' do
      post "/api/maps/#{map.id}/remix"
      expect(last_response.status).to eq 201
    end
 
    it 'creates a new map record' do
      expect { post "/api/maps/#{map.id}/remix" }.to change { Map.count }.by(+1)
    end
 
    it 'creates a associated lines for the new map record' do
      expect { post "/api/maps/#{map.id}/remix" }.to change { Line.count }.by(+3)
    end

    it 'returns the remixed map with lines' do
      post "/api/maps/#{map.id}/remix"
      expect(last_response.body).to eq Map.last.to_json
    end
  end

  describe 'GET /api/maps/:id' do
    let(:map) { create(:map) }

    it 'responds with 200 OK' do
      get "/api/maps/#{map.id}"
      expect(last_response.status).to eq 200
    end

    it 'returns the record' do
      get "/api/maps/#{map.id}"
      expect(last_response.body).to eq map.to_json
    end

    context 'not found' do
      it 'responds with 404 NOT FOUND' do
        max_id = Map.max(:id) || 0
        get "/api/maps/#{max_id + 1}"
        expect(last_response.status).to eq 404
      end
    end
  end

  describe 'POST /api/maps' do
    let(:params) { attributes_for(:map) }

    it 'responds with 201 CREATED' do
      post '/api/maps', params
      expect(last_response.status).to eq 201
    end

    it 'creates a new record' do
      expect { post '/api/maps', params }.to change{ Map.count }.by(+1)
    end

    it 'returns the new record' do
      post 'api/maps', params
      expect(last_response.body).to eq Map.last.to_json
    end
  end

  describe 'GET /api/maps' do
    it 'responds with 200 OK' do
      get '/api/maps'
      expect(last_response.status).to eq 200
    end

    it 'returns the list of maps' do
      maps = create_list(:map, 5)
      get '/api/maps', per: 2
      expect(last_response.body).to eq [maps[4], maps[3]].to_json
    end
  end
end
