# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=20.9.0
FROM node:${NODE_VERSION}-slim as base

LABEL fly_launch_runtime="Remix"

# Remix app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"

# Install pnpm
ARG PNPM_VERSION=8.12.0
RUN npm install -g pnpm@$PNPM_VERSION

# Throw-away build stage to reduce size of final image
FROM base as build

# Install packages needed to build node modules
RUN apt-get update -qq && \
  apt-get install -y build-essential pkg-config python-is-python3

# Install node modules
COPY --link package.json pnpm-lock.yaml ./
RUN pnpm i --frozen-lockfile --prod=false

# Copy application code
COPY --link . .

# Build application
RUN pnpm build

# Remove development dependencies
RUN pnpm prune --prod

# Final stage for app image
FROM base

# Copy built application
COPY --from=build /app /app

# Install nginx, sqlite3 and its dependencies
RUN apt-get update -y && apt-get install -y ca-certificates fuse3 nginx sqlite3
COPY --from=flyio/litefs:0.5 /usr/local/bin/litefs /usr/local/bin/litefs

# Configure nginx
RUN sed -i 's/access_log\s.*;/access_log stdout;/' /etc/nginx/nginx.conf && \
  sed -i 's/error_log\s.*;/error_log stderr info;/' /etc/nginx/nginx.conf

COPY <<-"EOF" /etc/nginx/sites-available/default
server {
  listen 3000 default_server;
  listen [::]:3000 default_server;
  access_log stdout;

  root /app/build/client;

  location / {
    try_files $uri @backend;
    add_header Cache-Control "public, max-age=31536000, immutable";
  }

  location @backend {
    proxy_pass http://localhost:3001;
    proxy_set_header Host $http_host;
  }
}
EOF

# Build a Procfile for production use
COPY <<-"EOF" /app/Procfile.prod
nginx: /usr/sbin/nginx -g "daemon off;"
app: PORT=3001 pnpm start:prod
EOF

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
ENTRYPOINT litefs mount
