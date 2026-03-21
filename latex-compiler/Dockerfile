# Use Ubuntu as base and install Tectonic
FROM ubuntu:22.04

# Avoid interactive prompts during build
ENV DEBIAN_FRONTEND=noninteractive

# Install Tectonic and dependencies
RUN apt-get update && apt-get install -y \
    curl \
    ca-certificates \
    fontconfig \
    libfontconfig1 \
    libgraphite2-3 \
    libharfbuzz0b \
    libicu70 \
    libpng16-16 \
    && rm -rf /var/lib/apt/lists/*

# Install Tectonic from continuous release (has ARM64 binaries)
RUN ARCH=$(dpkg --print-architecture) && \
    if [ "$ARCH" = "arm64" ]; then \
        TECTONIC_ARCH="aarch64-unknown-linux-musl"; \
    else \
        TECTONIC_ARCH="x86_64-unknown-linux-musl"; \
    fi && \
    TECTONIC_VERSION="0.15.0+20251006" && \
    curl -fsSL "https://github.com/tectonic-typesetting/tectonic/releases/download/continuous/tectonic-${TECTONIC_VERSION}-${TECTONIC_ARCH}.tar.gz" \
    -o /tmp/tectonic.tar.gz && \
    tar xzf /tmp/tectonic.tar.gz -C /usr/local/bin && \
    rm /tmp/tectonic.tar.gz && \
    chmod +x /usr/local/bin/tectonic

WORKDIR /compile

# Keep container running for compilation requests
CMD ["sleep", "infinity"]
