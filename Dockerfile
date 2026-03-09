# --- Stage 1: Build Frontend ---
FROM node:20-slim AS frontend-builder
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# --- Stage 2: Build Backend ---
FROM python:3.9-slim
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code and models
COPY app/ ./app/
COPY src/ ./src/
COPY models/ ./models/
COPY data/ ./data/

# Copy frontend build artifacts
COPY --from=frontend-builder /frontend/dist ./frontend/dist

# Expose port (7860 for Hugging Face Spaces)
EXPOSE 7860

# Run the app
CMD ["python", "app/app.py"]
