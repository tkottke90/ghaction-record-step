FROM node:12.18

WORKDIR /usr/app

COPY index.js .

COPY package.json .

COPY README.md .
COPY LICENSE .
COPY CHANGELOG.md .

RUN npm install --production

CMD [ "node", "index.js" ]
