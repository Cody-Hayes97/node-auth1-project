const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();

const Users = require("./users-model.js");

router.get("/users", auth, (req, res) => {
  Users.find()
    .then(user => {
      res.status(200).json(user);
    })
    .catch(err => {
      res.status(500).json({ Error: "failed to retrieve database", err });
    });
});

router.post("/register", (req, res) => {
  const userData = req.body;

  const hash = bcrypt.hashSync(userData.password, 12);
  userData.password = hash;

  Users.add(userData)
    .then(user => {
      res.status(201).json(user);
    })
    .catch(err => {
      res.status(500).json({ Error: "failed to retrieve database", err });
    });
});

router.post("/login", (req, res) => {
  let { username, password } = req.body;
  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        res.status(200).json({ message: `Welcome ${user.username}!`, user });
      } else {
        res.status(401).json({ message: "You Shall Not Pass1" });
      }
    })
    .catch(err => {
      res.status(500).json({ Error: "failed to retrieve database", err });
    });
});

function auth(req, res, next) {
  const { username, password } = req.headers;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        next();
      } else {
        res.status(401).json({ message: "You Shall Not Pass!" });
      }
    })
    .catch(err => {
      res.status(500).json({ message: "unexpected error", err });
    });
}

module.exports = router;
