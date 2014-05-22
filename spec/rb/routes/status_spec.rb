require './spec/rb/spec_helper.rb'

describe Transitmix::Routes::Status do
  include Transitmix::Routes::TestHelpers

  it 'returns the application status' do
    get '/.well-known/status'
    expect(last_response.body).to eq AppStatus.new.to_json
  end
end
