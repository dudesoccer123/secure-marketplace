# Step 1: Use the official Node.js image
FROM node:18

# Step 2: Set the working directory
WORKDIR /app

# Step 3: Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Step 4: Copy the rest of your application code
COPY . .

# Step 5: Expose the port your app runs on (e.g., 3000)
EXPOSE 3004

# Step 6: Start the Node.js server
CMD ["node", "src/server.js"]
