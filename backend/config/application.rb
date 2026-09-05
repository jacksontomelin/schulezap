require_relative "boot"

require "rails"
require "active_model/railtie"
require "active_record/railtie"
require "action_controller/railtie"
require "action_view/railtie"

Bundler.require(*Rails.groups)

module Schulezap
  class Application < Rails::Application
    config.load_defaults 7.1
    config.api_only = true

    # nomes de tabela/model em portugues nao devem ser pluralizados errado
    config.autoload_paths << Rails.root.join("app/serializers")

    config.middleware.insert_before 0, Rack::Cors do
      allow do
        origins ENV.fetch("CORS_ORIGINS", "*").split(",")
        resource "*",
          headers: :any,
          methods: %i[get post put patch delete options head],
          expose: %w[Authorization]
      end
    end
  end
end
