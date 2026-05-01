# Stage 1: Build
FROM node:24-alpine AS builder

# Install build dependencies for native modules (like sqlite3)
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy package files and install all dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Build the project
RUN yarn build

# Stage 2: Production
FROM node:24-alpine

# Still need build tools for native module installation in production stage 
# if we do a fresh yarn install --production
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/yarn.lock ./yarn.lock

# Install only production dependencies
RUN yarn install --production --frozen-lockfile

# Expose the application port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Run migrations using compiled JS and then start the application
CMD ["sh", "-c", "npx typeorm migration:run -d dist/database/index.js && node dist/index.js"]
