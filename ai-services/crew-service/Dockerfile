FROM python:3.12-slim

WORKDIR /app

# Copy requirements first to leverage Docker cache
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY . .

# Expose the service port
EXPOSE 8000

# Start the service using uvicorn
CMD ["uvicorn", "src.api.service:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
