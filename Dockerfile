# Use the official Node.js image as the base image
FROM node:16.18.0

# Set the working directory in the container
WORKDIR /todolist-v2

# Copy the application files into the working directory
COPY . /app

# Install the application dependencies
RUN npm install body-parser, express, ejs, lodash, mongodb, mongoose

# Define the entry point for the container
CMD ["npm", "start"]
