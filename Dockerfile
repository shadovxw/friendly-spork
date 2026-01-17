# Stage 1: Build the React application
FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
# Copy the built files from the previous stage to Nginx
COPY --from=builder /app/dist /usr/share/nginx/html
# Open port 80
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]