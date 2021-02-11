FROM node:15.8.0-alpine3.10
WORKDIR /app

RUN cd /app
COPY . .

RUN npm install
RUN npm run build
RUN echo $(ls -a)
RUN echo $(ls dist)
CMD ["npm", "run", "start"]
