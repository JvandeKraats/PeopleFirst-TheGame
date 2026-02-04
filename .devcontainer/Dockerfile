# See https://containers.dev/ for format details

FROM mcr.microsoft.com/devcontainers/javascript-node:1-24-bullseye

# Needed by mkcert flows (vite-plugin-mkcert) in many Linux environments.
RUN apt-get update \
  && apt-get install -y --no-install-recommends libnss3-tools \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*
