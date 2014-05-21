FactoryGirl.define do
  factory :line, class: Line do
    name { Faker::Lorem.words.join(' ') }
    color { ['red', 'green', 'blue'].sample }
    coordinates {
      Array.new(2) {
        Array.new((2..5).to_a.sample) {
          [Faker::Geolocation.lat, Faker::Geolocation.lng]
        }
      }
    }
  end

  factory :map, class: Map do
    name { Faker::Lorem.words.join(' ') }
    zoom_level { (1..4).to_a.sample }
    center { [Faker::Geolocation.lat, Faker::Geolocation.lng] }
  end
end
