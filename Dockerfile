# Stage 1: Build the frontend
FROM node:22 AS builder
WORKDIR /app
COPY . ./
RUN npm install
RUN npm run build

# Stage 2: Final image with server only
FROM node:22
WORKDIR /app

# Copy backend code and install server deps
COPY --from=builder /app/server ./server
WORKDIR /app/server
RUN npm install

# Copy built frontend into server folder
COPY --from=builder /app/dist ./dist

EXPOSE 8080
CMD ["node", "server.js"]