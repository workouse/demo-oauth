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

- Clone the repository `cd /home` `git clone https://py@gl3.freegigs.net/py/passprt.git` `cd passprt` `git checkout master`
- Go to the frontend directory `cd frontend`
- Run `npm install`
- Run `npm run build`
- Go to the root directory `cd ..`
- Go to the backend directory `cd backend`
- Run `npm install`
- Run `npx prisma generate`  
- Run `npm start`
- Open `http://localhost:3000` in your browser
- Add the following to nginx.conf:

```
  location / {
          proxy_pass http://localhost:3000;
          proxy_http_version 1.1;
          proxy_set_header Upgrade $http_upgrade;
          proxy_set_header Connection 'upgrade';
          proxy_set_header Host $host;
          proxy_cache_bypass $http_upgrade;
  }
```



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


## FAQ

### How to add new user with password 
You need to use [/users/register](https://sf111.lab.sgigs.com/users/register) endpoint with a POST request and a JSON body like this:

```json
{
    "username": "user@example.com",
    "password": "password"
}
```
Do not add user to database directly, password is hashed before saving to database.

### How to add new user with Google or Azure
Use sqlite3 cli to connect to the database and add a new user with the following SQL query:
```sql
INSERT INTO user (username, hashed_password, salt, email, providerId, provider) VALUES (?, ?, ?, ?,?,?)'
```
- `username` is the email of the user 
- `hashed_password` is the hashed password of the user, can be null for Google and Azure users
- `salt` is the salt of the user, can be null for Google and Azure users
- `email` is the email of the user
- `providerId` is the id of the user in the provider (Google or Azure)
- `provider` is the provider name (google or azure)



