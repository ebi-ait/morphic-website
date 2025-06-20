# Stage 1: Build the Gatsby app
FROM node:18 AS builder

# Set working directory inside the container
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application files
COPY . .

# Verify the file structure inside Docker
RUN ls -R /app/src/pages

# Clean Gatsby cache and public directories
RUN npm run clean

# Build the Gatsby app
RUN npm run build

# Stage 2: Serve the static site
FROM nginx:alpine

# Copy the custom Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built files from the builder stage
COPY --from=builder /app/public /usr/share/nginx/html

# Expose the port
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
