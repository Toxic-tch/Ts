FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt update && apt install -y \
    curl \
    ca-certificates \
    openssh-client \
    iproute2 \
    nodejs \
    npm \
    && rm -rf /var/lib/apt/lists/*

# Create directory
RUN mkdir -p /etc/pterodactyl
WORKDIR /etc/pterodactyl

# Download Wings
RUN curl -L https://github.com/pterodactyl/wings/releases/latest/download/wings_linux_amd64 -o wings
RUN chmod +x wings

# Copy config + app
COPY config.yml /etc/pterodactyl/config.yml
COPY index.js /etc/pterodactyl/index.js

EXPOSE 8080

CMD ["node", "index.js"]
