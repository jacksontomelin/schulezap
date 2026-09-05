# ─── Backend Rails (API) ───────────────────────────────────
FROM ruby:3.2.3-slim AS base

RUN apt-get update -qq && apt-get install -y --no-install-recommends \
    build-essential libpq-dev postgresql-client git \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# gems primeiro (cache de layer)
COPY Gemfile ./
RUN bundle install --jobs 4 --retry 3

COPY . .

ENV RAILS_ENV=production
ENV RAILS_LOG_TO_STDOUT=true
ENV RAILS_SERVE_STATIC_FILES=true

EXPOSE 3000

# entrypoint roda migrations e sobe o puma
COPY bin/docker-entrypoint /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint
ENTRYPOINT ["docker-entrypoint"]

CMD ["bundle", "exec", "puma", "-C", "config/puma.rb"]
