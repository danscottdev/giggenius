FROM python:3.10-slim

# Install system dependencies and cleanup in the same layer to reduce image size
RUN apt-get update && apt-get install -y \
    build-essential \
    gcc \
    g++ \
    git \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy dependency files
COPY pyproject.toml poetry.lock ./

# Install poetry and dependencies
RUN pip install poetry \
    && poetry config virtualenvs.create false \
    && poetry install --no-root

# Copy application code
COPY . .

# Command to run your application
CMD ["poetry", "run", "crewai_service"]
