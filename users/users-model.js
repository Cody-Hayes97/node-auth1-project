const db = require("../data/db-config.js");

module.exports = {
  add,
  find,
  findById,
  findBy
};

function add(userData) {
  return db("users")
    .insert(userData, "id")
    .then(ids => {
      const [id] = ids;
      return findById(id);
    });
}

function find() {
  return db("users").select("id", "username");
}

function findById(id) {
  return db("users")
    .select("id", "username")
    .where({ id })
    .first();
}

function findBy(filter) {
  return db("users")
    .select("id", "username", "password")
    .where(filter);
}
