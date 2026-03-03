# -------------------------------
# Inquiry Studio RAG Backend
# Production Dockerfile
# -------------------------------

# Use lightweight Node image
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Install all dependencies (including dev for build)
COPY package*.json ./
RUN npm install

# Copy the rest of the source code
COPY . .

# Build the application
RUN npm run build

# Cloud Run requires this environment variable
ENV PORT=8080

# Expose port
EXPOSE 8080

# Start server
CMD ["node", "server.js"]