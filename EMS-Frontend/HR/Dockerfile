# Use Node.js 22 Alpine as the base image
FROM node:22-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install frontend dependencies
RUN npm install

# Copy the remaining React/Vite project files
COPY . .

# Vite development server port
EXPOSE 5173

# Start Vite and allow access from outside the container
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]