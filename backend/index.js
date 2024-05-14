require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const passport = require('passport');
const {googleStrategyInstance ,azureADStrategyInstance }= require('./services/passport');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const { PrismaClient } = require('@prisma/client');
const path = require('path'); 
const prisma = new PrismaClient();
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_session_secret',
  resave: false,
  saveUninitialized: true,
  store: new SQLiteStore({ db: 'sessions.db', table: 'sessions' }),
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use('azure-ad', azureADStrategyInstance(prisma));
passport.use('google', googleStrategyInstance(prisma));

passport.serializeUser((user, done) => {
  // Serialize user object
  done(null, user);
});

passport.deserializeUser(async (user, done) => {
  const dbuser = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });
  done(null, dbuser);
});

// Middleware to add Prisma instance to request context
app.use((req, res, next) => {
  req.prisma = prisma;
  next();
});

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/users', require('./routes/users'));

app.use(express.static(path.join(__dirname, '../frontend/build')));

// Serve React application for any remaining requests
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});


// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

