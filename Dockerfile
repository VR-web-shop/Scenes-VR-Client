# Use Node.js 14 slim as the base image
FROM node:14-slim

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Copy environment files (.env) if needed
COPY .env* ./
COPY .npmrc* ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the static files
RUN npm run build

# Expose the port your app runs on (if needed)
EXPOSE 5174

# Define the command to serve your built static files
CMD ["npx", "serve", "-s", "build", "-l", "5174"]