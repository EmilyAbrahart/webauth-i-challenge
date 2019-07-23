const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

const authRouter = require('../auth/auth-router.js');
const usersRouter = require('../users/users-router.js');

const server = express();

server.use(helmet());
server.use(express.json());
server.use(session({
  name: 'sessionId', 
  secret: 'this is very very secret, shhhh!', 
  cookie: {
    maxAge: 1 * 24 * 60 * 60 * 1000,
    secure: false,
    httpOnly: true,
  },
  resave: false,
  saveUninitialized: true,
  store: new KnexSessionStore({
    knex: require('../data/db.js'), 
    tablename: 'sessions', 
    sidfieldname: 'sessionid', 
    createtable: true, 
    clearInterval: 1000 * 60 * 60, 
  }),
}));
server.use(cors());

server.use('/api/auth', authRouter);
server.use('/api/users', usersRouter);

server.get('/', (req, res) => {
	res.send('Welcome to WebAuth I Challenge');
});

module.exports = server;