# Build stage
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Expose port
EXPOSE 3000

# Start application
CMD ["npm", "run", "start:prod"]
