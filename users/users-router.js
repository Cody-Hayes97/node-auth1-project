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
        req.session.loggedin = true;
        res.status(200).json({ message: `Welcome ${user.username}!`, user });
      } else {
        res.status(401).json({ message: "You Shall Not Pass1" });
      }
    })
    .catch(err => {
      res.status(500).json({ Error: "failed to retrieve database", err });
    });
});

router.get("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.send("session not destroyed");
      } else {
        res.send("logged out see you soon!");
      }
    });
  } else {
    res.end();
  }
});

function auth(req, res, next) {
  if (req.session.loggedin && req.session.loggedin === true) {
    next();
  } else {
    res.status(400).json({ message: "you shall not pass" });
  }
}

module.exports = router;
