const axios = require('axios');
const db = require('../database/user');
const bcrypt = require('bcryptjs');

const { authenticate, generateToken } = require('../auth/authenticate');
const { passwordProtection, checkFields, loginCheck } = require('../middleware/middleware');

module.exports = server => {
  server.post('/api/register', checkFields, register);
  server.post('/api/login', loginCheck, login);
  server.get('/api/jokes', authenticate, getJokes);
};

function register(req, res) {
  const user = req.body;
  user.password = passwordProtection(user.password);
  db.add(user)
    .then(res => {
      res.status(201).json({ message: 
        "Account created successfully!"})
    })
    .catch(err => {
      res.status(500).json({
        message: "Unable to add account"
      })
    })
}

function login(req, res) {
  const loginUser = req.body;
  db.login(loginUser.username)
    .then(response => {
      if(bcrypt.compareSync(loginUser.password, response.password) === true ){
        const token = generateToken(response.username, response.id);
        res.status(200).json({
          message: 'Login successful!',
          token: token
        })
      } else {
        res.status(404).json({
          message: "Invalid username or password"
        })
      }
    })
    .catch(err => {
      res.status(500).json({
        message: 'Unable to login.'
      })
    })
}

function getJokes(req, res) {
  const requestOptions = {
    headers: { accept: 'application/json' },
  };

  axios
    .get('https://icanhazdadjoke.com/search', requestOptions)
    .then(response => {
      res.status(200).json(response.data.results);
    })
    .catch(err => {
      res.status(500).json({ message: 'Error Fetching Jokes', error: err });
    });
}