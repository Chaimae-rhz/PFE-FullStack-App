# Étape 1 : Utiliser une image de base pour Node.js pour construire l'application Angular
FROM node:20.14.0 AS build

# Définir le répertoire de travail dans le conteneur
WORKDIR /app
# Copier le fichier package.json et package-lock.json dans le répertoire de travail
COPY package*.json ./
# Installer les dépendances
RUN npm install
# Copier le reste de l'application Angular dans le répertoire de travail
COPY . .
# Compiler l'application Angular pour la production
RUN npm run build -- --output-path=./dist/frontend-ang
# Étape 2 : Utiliser une image de base pour Nginx pour servir l'application Angular
FROM nginx:alpine as production-stage
# Copier les fichiers compilés de l'application Angular dans le répertoire Nginx
COPY --from=build /app/dist/frontend-ang/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Exposer le port 4201 pour accéder à l'application
EXPOSE 4201
# Démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]
