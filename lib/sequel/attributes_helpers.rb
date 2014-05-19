module Sequel
  module Plugins
    module AttributesHelpers
      module InstanceMethods
        def attributes
          self.class.columns.reduce({}) do |res, attribute|
            res[attribute] = public_send(attribute)
            res
          end
        end
        
        # hash of allowed pairs - used to easily remix w/ serialized values
        # Sequel::Model#values does not invoke deserializers
        def allowed_attributes
          attributes.select { |k,_| self.class.allowed_columns.include?(k) }
        end
      end
    end
  end
end
