require "active_support/core_ext/integer/time"

Rails.application.configure do
  config.cache_classes = true
  config.eager_load = true
  config.consider_all_requests_local = false

  config.log_level = :info
  config.log_tags = [:request_id]
  if ENV["RAILS_LOG_TO_STDOUT"].present?
    logger = ActiveSupport::Logger.new($stdout)
    logger.formatter = config.log_formatter
    config.logger = ActiveSupport::TaggedLogging.new(logger)
  end

  config.active_record.dump_schema_after_migration = false
  config.action_dispatch.default_headers = { "X-Content-Type-Options" => "nosniff" }

  # usa SECRET_KEY_BASE do ambiente (setado no Coolify)
  config.require_master_key = false
end
