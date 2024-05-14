FROM node:16 
#frontend build
WORKDIR /usr/src/app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend .
RUN npm run build

#backend build
WORKDIR /usr/src/app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend .

RUN npx prisma generate

# Expose port
EXPOSE 3000

# Command to run the application
CMD [ "node", "index.js" ]

