module Transitmix
  module Routes
    class Home < Sinatra::Application
      configure do
        set :root, File.expand_path('../../../', __FILE__)
        set :views, 'app/views'
        set :scss, { load_paths: ["#{root}/public/css"] }
      end

      register Sinatra::AssetPack

      assets do
        serve '/js',  from: 'public/js'
        serve '/css', from: 'public/css'

        js :app, [
          '/js/app.js',
          '/js/utils.js',
          '/js/framework/*.js',
          '/js/router.js',
          '/js/components/app/*.js',
          '/js/components/map/*.js',
          '/js/components/home/*.js',
          '/js/datastores/*.js',
        ]

        css :app, [
          '/css/style.css',
         ]

        js_compression :uglify
        css_compression :sass
      end

      get '/*' do
        erb :index
      end
    end
  end
end
