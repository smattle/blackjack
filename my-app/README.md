AWS: http://3.236.112.126:3000

Beim Deployment habe ich mit AWS gearbeitet, da ich damit bereits bekannt war und es konsistenter funktioniert hat als Auzre.


##### Dockerfile:

FROM node:18

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]


Das Dockerfile hat 7 logische Level. 


###### Base Image: 
FROM node:18

###### Arbeitsverzeichnis festlegen:
WORKDIR /app

###### Abhängigkeiten installieren:
COPY package*.json ./
RUN npm install

###### Code kopieren:
COPY . .

###### Anwendung bauen:
RUN npm run build

###### Port freigeben:
EXPOSE 3000

###### Anwendung starten:
CMD ["npm", "start"]


Das ganze ist ein ziemlich normales Dockerfile. Was ich mir dabei gedacht habe war lediglich die Abhängigkeiten und den Code zu trennen um die Wiederverwendbarkeit zu fördern.
