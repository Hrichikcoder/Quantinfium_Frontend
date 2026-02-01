# Use an official Node.js image as a base
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Accept build-time args for Vite environment variables
ARG VITE_BACKEND_URL
ARG VITE_BASE_URL

# Generate .env.local for Vite to consume at build time
RUN echo "VITE_BACKEND_URL=$VITE_BACKEND_URL" > .env.local \
    && echo "VITE_BASE_URL=$VITE_BASE_URL" >> .env.local

# Build the React app (Vite outputs to "dist" by default)
RUN npm run build

# Install a lightweight web server (e.g., serve)
RUN npm install -g serve

# Expose port 3000
EXPOSE 3000

# Start the app serving the Vite build output
CMD ["serve", "-s", "dist", "-l", "3000"]