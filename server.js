const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const app = express();
const cors = require("cors");
const knex = require("knex");

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    // port: 3306,
    user: "emameziebebeinwe",
    password: "",
    database: "smart-brain",
  },
});

//creating a middleware
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("success");
});

app.post("/signin", (req, res) => {
  // const { email, password } = req.body;
  db.select("email", "hash")
    .from("login")
    .where("email", "=", req.body.email)
    .then((data) => {
      //check if user paswword input matches stored db password
      const isValid = bcrypt.compareSync(req.body.password, data[0].hash); // true
      if (isValid) {
        return db
          .select("*")
          .from("users")
          .where("email", "=", req.body.email)
          .then((user) => {
            res.json(user[0]);
          })
          .catch((err) => res.status(400).json("unable to get user"));
      } else {
        res.status(400).json("wrong credentials");
      }
    })
    .catch((err) => res.status(400).json("wrong credentials"));
});

app.post("/register", (req, res) => {
  const { email, name, password } = req.body;
  //   // Store hash in your password DB.
  const hash = bcrypt.hashSync(password);

  db.transaction((trx) => {
    return trx
      .insert({
        hash: hash,
        email: email,
      })
      .into("login")
      .returning("email")
      .then((loginEmail) => {
        return trx("users")
          .returning("*")
          .insert({
            name: name,
            email: loginEmail[0].email,
            joined: new Date(),
          })
          .then((user) => res.json(user[0]))
          .then(trx.commit)
          .then(trx.rollback)
          .catch((err) => res.status(400).json("unable to register"));
      });
  });
});

app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  db.select("*")
    .from("users")
    .where({ id })
    .then((user) => {
      if (user.length) {
        res.json(user[0]);
      }
    })
    .catch((err) => res.status(400).json("user not found"));
});

app.put("/image", (req, res) => {
  const { id } = req.body;
  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => res.json(entries[0].entries))
    .catch((err) => json.status(400).json("unable to get count"));
});

app.listen(3000, () => {
  console.log("working fine app is running on port 3000");
});

/*
/  --> res -- this is working
/signin -->POST success/fail
/regtister --> POST = user
/profile/:userId -- GET = user
/image  --> PUT --> = user

*/
