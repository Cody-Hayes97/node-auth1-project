const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const session = require("express-session");
const knexSessionStore = require("connect-session-knex")(session);

const UsersRouter = require("./users/users-router.js");

const server = express();

const sessionConfig = {
  name: "monkey",
  secret: "cookiesareyummy",
  cookie: {
    maxAge: 1000 * 60 * 60,
    secure: false,
    httpOnly: true
  },
  resave: false,
  saveUninitialized: false,

  store: new knexSessionStore({
    knex: require("./data/db-config.js"),
    tablename: "sessions",
    sidfieldname: "sid",
    createtable: true,
    clearInterval: 100 * 60 * 60
  })
};

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));

server.use("/api", UsersRouter);

server.get("/", (req, res) => {
  res.send("Hello World!");
});

module.exports = server;
