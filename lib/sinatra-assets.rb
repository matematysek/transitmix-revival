require 'sprockets'
require 'sprockets/cache/file_store'

module Sinatra
  module AssetsExtension
    class UnknownAsset < StandardError; end

    module Helpers
      def asset_path(path)
        asset = Transitmix::App.assets[path]
        raise UnknownAsset, "missing asset: #{path}" unless asset
        "/assets/#{asset.digest_path}"
      end
    end

    def self.registered(app)
      assets = Sprockets::Environment.new

      # include helpers in ERB context
      assets.context_class.class_eval do
        include Sinatra::AssetsExtension::Helpers
      end

      # access sprockets environment through application
      app.set :assets, assets

      # declare asset engines
      assets.css_compressor = :scss
      app.configure :production do
        assets.js_compressor  = :uglify
      end

      # setup asset paths
      assets.append_path('app/assets/css')
      assets.append_path('app/assets/js')

      # mixin helper methods to application
      app.helpers Sinatra::AssetsExtension::Helpers

      app.configure :development do
        assets.cache = Sprockets::Cache::FileStore.new('./tmp')
      end
    end
  end

  register AssetsExtension
end
