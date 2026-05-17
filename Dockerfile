# Use an official Node.js runtime as a parent image
FROM node:24-alpine AS builder

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production environment
FROM node:24-alpine

WORKDIR /app

# Copy built assets and production package.json
COPY --from=builder /app/build build/
COPY --from=builder /app/node_modules node_modules/
COPY package.json .

# Cloud Run uses the PORT environment variable.
ENV PORT=8080
EXPOSE 8080

# Start the application
CMD ["node", "build/index.js"]
