# Stage 1: Build the Gatsby app
FROM node:18 AS builder

# Set working directory inside the container
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application files
COPY . .

RUN echo "==> Listing /app/static"; ls -l /app/static || true
RUN echo "==> Grep for TSV in /app/static"; find /app/static -maxdepth 1 -name "*.tsv" -print

# Verify the file structure inside Docker
RUN ls -R /app/src/pages

# Clean Gatsby cache and public directories
RUN npm run clean

# Build the Gatsby app
RUN npm run build

RUN echo "==> Looking for TSV in /app/public"; ls -l /app/public | grep -i cell_lines.tsv || true

# Stage 2: Serve the static site
FROM nginx:alpine

# Copy the custom Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built files from the builder stage
COPY --from=builder /app/public /usr/share/nginx/html

RUN echo "==> Checking final Nginx root"; ls -l /usr/share/nginx/html | grep -i cell_lines.tsv || true

# Expose the port
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
