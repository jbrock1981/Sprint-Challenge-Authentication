const axios = require("axios");
const jwt = require("jsonwebtoken");
const bcyrpt = require("bcryptjs");
const db = require("../database/dbConfig");
const { authenticate } = require("../auth/authenticate");

module.exports = server => {
  server.post("/api/register", register);
  server.post("/api/login", login);
  server.get("/api/jokes", authenticate, getJokes);
};

const secret = process.env.JWT_SECRET || "oopsitdidntwork";

function generateToken(user) {
  const payload = {
    username: user.username
  };

  const options = {
    expiresIn: "42m",
    jwtid: '8675309'
  };

  return jwt.sign(payload, secret, options);
}

function register(req, res) {
  // implement user registration
  const credentials = req.body;
  const hash = bcyrpt.hashSync(credentials.password, 14);
  credentials.password = hash;

  db("users")
    .insert(credentials)
    .then(ids => {
      const id = ids[0];

      db("users")
        .where({ id })
        .first()
        .then(user => {
          const token = generateToken(user);
          res.status(201).json({ id: user.id, token });
        });
    })
    .catch(err => {
      res.status(500).json(err);
    });
};

function login(req, res) {
  // implement user login
  const credentials = req.body;

  db("users")
    .where({ username: credentials.username })
    .first()
    .then(user => {
      if (user && bcyrpt.compareSync(credentials.password, user.password)) {
        const token = generateToken(user);
        res.status(200).json({ message: "Logged in", token });
      } else {
        res.status(401).json({ message: "You shall not pass!" });
      }
    })
    .catch(err => {
      res.status(500).json({ err });
    });
};

function getJokes(req, res) {
  const requestOptions = {
    headers: { accept: "application/json" }
  };

  axios
    .get("https://icanhazdadjoke.com/search", requestOptions)
    .then(response => {
      res.status(200).json(response.data.results);
    })
    .catch(err => {
      res.status(500).json({ message: "Error Fetching Jokes", error: err });
    });
}