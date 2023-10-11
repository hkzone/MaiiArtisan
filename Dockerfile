# Use a base image with Node.js installed
FROM node:11


# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./




# Install project dependencies
RUN npm install --ommit dev


# Copy the application code to the working directory
COPY . .

# Build the JavaScript bundle
RUN npm run build:js 

# Expose the port that your application listens on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]