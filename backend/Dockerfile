FROM python:3.10-slim

# Prevent Python from writing .pyc files and buffering stdout
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Install dependencies first (better layer caching)
COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt

# Copy the application code
COPY . /app

# Default environment for dev; can be overridden by compose
ENV PGHOST=postgres \
    PGDATABASE=msgboard \
    PGUSER=postgres \
    PGPASSWORD=postgres \
    PGPORT=5432 \
    DJANGO_DEBUG=1

EXPOSE 8000

CMD ["sh", "-c", "python backend/manage.py migrate && python backend/manage.py runserver 0.0.0.0:8000"]
