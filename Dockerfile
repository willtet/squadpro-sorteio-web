# Etapa 1: Construção da aplicação Angular
FROM node:20 AS build
WORKDIR /app

# Copia package.json e package-lock.json antes de instalar as dependências
COPY package*.json ./
RUN npm install

# Copia todos os arquivos do projeto
COPY . .

# Realiza o build SSR (browser + server)
RUN npm run build --configuration=production


# Etapa 2: Servir a aplicação com Nginx
FROM nginx:latest
COPY --from=build /app/dist/sorteio-squadpro-web/browser/ /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 4201
CMD ["nginx", "-g", "daemon off;"]
