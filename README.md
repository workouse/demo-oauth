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

> All configurations will be done in the backend directory

- Create a `.env` file in the backend directory
- Copy content from `.env.dist` to `.env`
- Fill the `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` with your Google OAuth credentials
- Fill the `AZURE_CLIENT_ID` and `AZURE_CLIENT_SECRET` and `AZURE_TENANT_ID` with your Azure OAuth credentials
- Fill the `SESSION_SECRET` with a random string

### Run with docker-compose

> This is the easiest way to run the application

- Clone the repository
- cd to project directory
- make configuration changes as mentioned above
- Run `docker-compose up --build`
- Open `http://localhost:3000` in your browser

### Run with docker 

- Clone the repository
- cd to project directory
- Make configuration changes as mentioned above
- Run `docker build -t demo-oauth-app .`
- Run `docker run -p 3000:3000 demo-oauth-app`
- Open `http://localhost:3000` in your browser

### Run with Makefile

- Clone the repository
- Make configuration changes as mentioned above
- Run `make build`
- Run `make run`
- Open `http://localhost:3000` in your browser

### Run with npm

- Clone the repository `cd /home` `git clone https://py@gl3.freegigs.net/py/passprt.git` `cd passprt` `git checkout master`
- Make configuration changes as mentioned above
- Go to the frontend directory `cd frontend`
- Run `npm install`
- Run `npm run build`
- Go to the root directory `cd ..`
- Go to the backend directory `cd backend`
- Run `npm install`
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

### How to reset database

There is two database in backend folder. database.db for as user database, sessions.db is for session storage. You can delete these files to reset the database.

### How to generate GOOGLE secrets

- Go to [Google Developer Console](https://console.developers.google.com/)
- Create a new project
- Go to `Credentials` tab
- Create a new OAuth 2.0 Client ID
- Fill the form with your domain and redirect URI (https://example.com/auth/google/callback)
- Copy the `Client ID` and `Client Secret` to the `.env` file

### How to generate Azure secrets

- Go to [Azure App Registration](https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationsListBlade)
- Create a new app registration
- Go to `Certificates & secrets` tab
- Create a new client secret
- Copy the `Client ID`, `Client Secret` and `Tenant ID` to the `.env` file


### Errors 

- `Error: listen EADDRINUSE: address already in use :::3000` 
  - This error occurs when the port 3000 is already in use. You can change the port in the `.env` file by changing the `PORT` variable.
- `Error: SQLITE_CANTOPEN: unable to open database file`
  - This error occurs when the database file is not found. You can create the database file by running the application or by creating an empty file with the name `database.db` in the backend directory. 
- `Error: SQLITE_CONSTRAINT: UNIQUE constraint failed: user.username`
  - This error occurs when you try to add a user with an existing username. You can change the username or delete the existing user from the database. We are using email addresses as username. You can see that error if you try to connect with the same email address with different providers (Google, Azure, etc.).
- `TypeError: Invalid value for clientId.The value cannot be empty`
  - This error occurs when the `GOOGLE_CLIENT_ID` or `AZURE_CLIENT_ID` is not set in the `.env` file. You need to set the `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` or `AZURE_CLIENT_ID`, `AZURE_CLIENT_SECRET` and `AZURE_TENANT_ID` in the `.env` file.


## Links 

- [Google Developer Console](https://console.developers.google.com/)
- [Azure App Registration](https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationsListBlade)
- [Docker](https://www.docker.com/)
- [Docker-compose](https://docs.docker.com/compose/)
- [Make](https://www.gnu.org/software/make/)
- [Node.js](https://nodejs.org/en/)
- [React](https://reactjs.org/)
- [Express](https://expressjs.com/)
- [Passport](http://www.passportjs.org/)
- [SQLite](https://www.sqlite.org/index.html)
