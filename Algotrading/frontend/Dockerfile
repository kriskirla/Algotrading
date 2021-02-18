FROM node

WORKDIR /app/frontend
COPY package.json /app/frontend

RUN npm init -y
RUN npm i webpack webpack-cli --save-dev
RUN npm i @babel/core babel-loader @babel/preset-env @babel/preset-react --save-dev
RUN npm i react react-dom --save-dev
RUN npm install @material-ui/core
RUN npm install @babel/plugin-proposal-class-properties
RUN npm install react-router-dom
RUN npm install @material-ui/icons

EXPOSE 3000
CMD ["npm", "run", "dev"]