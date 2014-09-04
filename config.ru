require './app'
use Rack::Deflater

map '/assets' do
  run Transitmix::App.assets
end

map '/' do
  run Rack::Cascade.new [
    Transitmix::Routes::Status,
    Transitmix::Routes::Lines,
    Transitmix::Routes::Maps,
    Transitmix::Routes::Home
  ]
end
