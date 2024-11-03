# Stage 1: Build the Vue.js application
FROM node:18-alpine AS build-stage
WORKDIR /app

# Kopiere die package.json und package-lock.json Dateien
COPY package*.json ./

# Installiere die Abhängigkeiten
RUN npm install

# Kopiere den Rest des App-Codes
COPY . .

# Baue die Applikation für die Produktion
RUN npm run build

# Stage 2: NGINX für die Produktion 
FROM nginx:alpine AS production-stage

# Entferne die Standard-Nginx-Seiten
RUN rm -rf /usr/share/nginx/html/*

# Kopiere den Vue.js Build aus der ersten Stage in das NGINX-Verzeichnis
COPY --from=build-stage /app/dist /usr/share/nginx/html


# Exponiere den Standard-NGINX-Port
EXPOSE 80

# Starte NGINX
CMD ["nginx", "-g", "daemon off;"]
