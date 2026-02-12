# Dockerfile pour Admin SG Stock (Vue.js)
FROM node:20-alpine as build

WORKDIR /app

# Arguments de build pour les variables d'environnement Vite
ARG VITE_API_PORT
ARG VITE_API_BASE_DOMAIN
ARG VITE_USE_HTTPS
ARG VITE_WS_PORT
ARG VITE_WS_BASE_DOMAIN
ARG VITE_SUPERADMIN_MODE

# Copier les fichiers de configuration
COPY package*.json ./

# Installer les dépendances
RUN npm ci --production=false

# Copier le code source
COPY . .

# Vérifier la présence de .env.production
RUN ls -la .env* || echo "Aucun fichier .env trouvé"

# Build de production avec variables d'environnement explicites
ENV VITE_API_PORT=${VITE_API_PORT}
ENV VITE_API_BASE_DOMAIN=${VITE_API_BASE_DOMAIN}
ENV VITE_USE_HTTPS=${VITE_USE_HTTPS}
ENV VITE_WS_PORT=${VITE_WS_PORT}
ENV VITE_WS_BASE_DOMAIN=${VITE_WS_BASE_DOMAIN}
ENV VITE_SUPERADMIN_MODE=${VITE_SUPERADMIN_MODE}

RUN NODE_ENV=production npm run build -- --mode production

# Stage de production avec Nginx
FROM nginx:alpine

# Copier la configuration Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copier les fichiers buildés
COPY --from=build /app/dist /usr/share/nginx/html

# Exposer le port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
