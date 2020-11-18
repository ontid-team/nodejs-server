FROM node:14.7.0-alpine3.10
# Create directory
RUN mkdir -p /src/edgescreen-backend
WORKDIR /src/edgescreen-backend
# Install app dependencies
COPY . .
RUN npm ci \
  && npm i -g pino \
  && npm i -g pino-pretty \
  && npm run build
EXPOSE 5555
CMD ["npm", "start"]



