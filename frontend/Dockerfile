FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Expose dev server port
EXPOSE 3000

# Command to run dev server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]