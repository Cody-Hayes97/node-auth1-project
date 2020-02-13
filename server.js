const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

const UsersRouter = require("./users/users-router.js");

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use("/api", UsersRouter);

server.get("/", (req, res) => {
  res.send("Hello World!");
});

module.exports = server;
