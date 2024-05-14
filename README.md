# Demo Oauth Application

### Feature list

- [x] Homepage
- [x] Login with Google
- [x] Login with Azure (Office365)
- [x] Logout 

## How to run 

### Prerequisites

- Node.js
- Docker
- Docker-compose
- Make

### Configuration

- Create a `.env` file in the backend directory
- Copy content from `.env.dist` to `.env`
- Fill the `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` with your Google OAuth credentials
- Fill the `AZURE_CLIENT_ID` and `AZURE_CLIENT_SECRET` and `AZURE_TENANT_ID` with your Azure OAuth credentials
- Fill the `SESSION_SECRET` with a random string


### With docker-compose

- Clone the repository
- Run `docker-compose up --build`
- Open `http://localhost:3000` in your browser

### With docker 

- Clone the repository
- Run `docker build -t demo-oauth-app .`
- Run `docker run -p 3000:3000 demo-oauth-app`
- Open `http://localhost:3000` in your browser

### With Makefile

- Clone the repository
- Run `make build`
- Run `make run`
- Open `http://localhost:3000` in your browser

### Run with bare hands 

- Clone the repository
- Go to the frontend directory `cd frontend`
- Run `npm install`
- Run `npm build`
- Go to the root directory `cd ..`
- Go to the backend directory `cd backend`
- Run `npm install`
- Run `npx prisma generate`  
- Run `npm start`
- Open `http://localhost:3000` in your browser



## Links 

- [Google Developer Console](https://console.developers.google.com/)
- [Azure App Registration](https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationsListBlade)
- [Docker](https://www.docker.com/)
- [Docker-compose](https://docs.docker.com/compose/)
- [Make](https://www.gnu.org/software/make/)
- [Node.js](https://nodejs.org/en/)
- [Prisma](https://www.prisma.io/)
- [React](https://reactjs.org/)
- [Express](https://expressjs.com/)
- [Passport](http://www.passportjs.org/)


