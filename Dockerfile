# Étape 1 : Build de l'application Angular
FROM node:20 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build --prod

# Étape 2 : Servir l'app avec Nginx
FROM nginx:alpine

# Copie du build Angular dans le dossier de Nginx
COPY --from=build /app/dist/olive-recours-v2/ /usr/share/nginx/html

# Exposer le port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
