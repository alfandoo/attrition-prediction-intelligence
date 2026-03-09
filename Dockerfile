# --- Stage 1: Build Frontend ---
FROM node:20-slim AS frontend-builder
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# --- Stage 2: Build Backend ---
FROM python:3.9-slim

# Install system dependencies as root
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Set up a non-root user for Hugging Face Spaces compatibility
RUN useradd -m -u 1000 user

# Switch to the new user and set working directory
USER user
ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH
WORKDIR $HOME/app

# Install Python dependencies (as user)
COPY --chown=user requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt

# Copy project files and set ownership to 'user'
COPY --chown=user app/ ./app/
COPY --chown=user src/ ./src/
COPY --chown=user models/ ./models/
COPY --chown=user data/ ./data/

# Copy frontend build artifacts
COPY --chown=user --from=frontend-builder /frontend/dist ./frontend/dist

# Expose port (7860 for Hugging Face Spaces)
EXPOSE 7860

# Run the app
CMD ["python", "app/app.py"]
