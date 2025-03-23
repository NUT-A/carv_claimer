FROM oven/bun:latest as base

WORKDIR /app

# Copy package.json and lock file
COPY package.json bun.lock ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy the rest of the application
COPY . .

# Create a directory for .keys files
RUN mkdir -p /app/keys

# Set environment variables
ENV NODE_ENV=production

# Run the application
CMD ["bun", "start"]
