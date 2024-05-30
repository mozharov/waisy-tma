FROM mcr.microsoft.com/devcontainers/javascript-node:1-20-bullseye

# [Optional] Uncomment this section to install additional OS packages.
# RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
#     && apt-get -y install --no-install-recommends <your-package-list-here>

ARG EXTRA_NODE_VERSION=20.13.1
RUN su node -c "source /usr/local/share/nvm/nvm.sh && nvm install ${EXTRA_NODE_VERSION}"
RUN su node -c "source /usr/local/share/nvm/nvm.sh && nvm use ${EXTRA_NODE_VERSION}"

RUN su node -c "npm install -g npm@10.8.1"