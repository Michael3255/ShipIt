# Use Node 24 as base image
FROM node:24-slim

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json .
RUN npm install

# Copy project files
COPY . .

# Expose port
EXPOSE 5173

# Start Vite dev server
CMD ["npm", "run", "dev", "--", "--host"]