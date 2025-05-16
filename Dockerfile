# Use Node.js base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Expose no ports (Discord bots are outbound)
# CMD to run the bot
CMD ["node", "index.js"]
