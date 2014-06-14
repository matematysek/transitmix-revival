require 'lib/sequel/attributes_helpers'
require 'lib/sequel/save_helpers'

Sequel.default_timezone = :utc

Sequel::Model.strict_param_setting = false

Sequel::Model.plugin :timestamps, update_on_create: true
Sequel::Model.plugin :serialization
Sequel::Model.plugin :json_serializer
Sequel::Model.plugin Sequel::Plugins::AttributesHelpers
Sequel::Model.plugin Sequel::Plugins::SaveHelpers

# enable pagination
Sequel::Model.db.extension :pagination

module Transitmix
  module Models
  end
end

require 'app/models/line'
require 'app/models/map'
require 'app/models/app_status'
require 'app/models/serializers/kml'
require 'app/models/serializers/shapefile'
