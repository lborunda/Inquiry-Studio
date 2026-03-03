# -------------------------------
# Inquiry Studio RAG Backend
# Production Dockerfile
# -------------------------------

# Use lightweight Node image
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Install only production dependencies first (better layer caching)
COPY package*.json ./
RUN npm install --omit=dev

# Copy the rest of the source code
COPY . .

# Cloud Run requires this environment variable
ENV PORT=8080

# Expose port
EXPOSE 8080

# Start server
CMD ["node", "server.js"]