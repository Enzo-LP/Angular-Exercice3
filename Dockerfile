# Étape 1 : Construction de l'application Angular
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build -- --configuration=production --project=exercice3

# Étape 2 : Servir l'application avec Nginx
FROM nginx:alpine

COPY --from=build /app/dist/exercice3/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
