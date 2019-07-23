const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const Users = require('./users/users-model.js');

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

server.get('/', (req, res) => {
	res.send('Welcome to WebAuth I Challenge');
});

// Register
server.post('/api/register', (req, res) => {
	const user = req.body;
	user.password = bcrypt.hashSync(user.password, 12);

	Users.add(user)
		.then(newUser => {
			res.status(201).json(newUser);
		})
		.catch(err => {
			res.status(500).json(err);
		});
});

// Login
server.post('/api/login', (req, res) => {
	const { username, password } = req.body;

	Users.findBy({ username })
		.first()
		.then(user => {
			if (user && bcrypt.compareSync(password, user.password)) {
				req.session.user = user;
				res.status(200).json({
					message: 'Logged In!'
				});
			} else {
				res.status(401).json({ message: 'You shall not pass!' });
			}
		})
		.catch(error => {
			res.status(500).json(error);
		});
});

// Get Users
server.get('/api/users', (req, res) => {
	Users.find()
		.then(users => {
			res.json(users);
		})
		.catch(err => res.send(err));
});

server.listen(5000, () => console.log('Running on port 5000!'));
