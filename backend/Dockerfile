FROM python:3.11-slim

WORKDIR /app

# Install system dependencies (incl. tectonic runtime libs)
RUN apt-get update && apt-get install -y \
    gcc \
    curl \
    ca-certificates \
    fontconfig \
    libfontconfig1 \
    libgraphite2-3 \
    libharfbuzz0b \
    libpng16-16 \
    poppler-utils \
    && rm -rf /var/lib/apt/lists/*

# Install Tectonic (LaTeX engine used by app.routers.compile)
RUN ARCH=$(dpkg --print-architecture) && \
    if [ "$ARCH" = "arm64" ]; then \
        TECTONIC_ARCH="aarch64-unknown-linux-musl"; \
    else \
        TECTONIC_ARCH="x86_64-unknown-linux-musl"; \
    fi && \
    TECTONIC_VERSION="0.15.0" && \
    curl -fsSL "https://github.com/tectonic-typesetting/tectonic/releases/download/tectonic@${TECTONIC_VERSION}/tectonic-${TECTONIC_VERSION}-${TECTONIC_ARCH}.tar.gz" \
    -o /tmp/tectonic.tar.gz && \
    tar xzf /tmp/tectonic.tar.gz -C /usr/local/bin && \
    rm /tmp/tectonic.tar.gz && \
    chmod +x /usr/local/bin/tectonic

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port
EXPOSE 8000

# Run application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
