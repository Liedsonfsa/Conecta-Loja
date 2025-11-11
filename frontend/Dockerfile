# Use Node.js 18 Alpine for smaller image size
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code and configuration files
COPY . .

# Expose port 5173 (default Vite dev server port)
EXPOSE 5173

# Default command for development with hot reload
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
