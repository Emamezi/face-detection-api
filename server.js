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

// db.select("*")
//   .from("users")
//   .then((data) => console.log(data));

//creating a middleware
app.use(express.json());
app.use(cors());

const database = {
  users: [
    {
      id: 123,
      name: "John",
      email: "john@gmail.com",
      password: "cookies",
      entries: 0,
      joined: new Date(),
    },
    {
      id: 124,
      name: "Sally",
      email: "sally@gmail.com",
      password: "bananas",
      entries: 0,
      joined: new Date(),
    },
  ],
  login: [
    {
      id: "1233",
      hash: "",
      email: "john@gmail.com",
    },
  ],
};
app.get("/", (req, res) => {
  res.send(database.users);
});

app.post("/signin", (req, res) => {
  // Load hash from your password DB.

  // bcrypt.compare(
  //   "grape",
  //   "$2a$10$CVzpB5h/4rJrY0Rf0Nq6OuErDQrVFl9HRA7qWbW.PBvJxokL0A1r.",
  //   function (err, res) {
  //     console.log("first guess:", res);
  //     // res == true
  //   }
  // );

  // bcrypt.compare(
  //   "veggies",
  //   "$2a$10$CVzpB5h/4rJrY0Rf0Nq6OuErDQrVFl9HRA7qWbW.PBvJxokL0A1r.",
  //   function (err, res) {
  //     // res = false
  //     console.log("second guess:", res);
  //   }
  // );
  if (
    req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password
  ) {
    res.json(database.users[0]);
  } else {
    res.status(400).json("error signing in ");
  }
});

app.post("/register", (req, res) => {
  const { email, name, password } = req.body;
  bcrypt.hash(password, null, null, function (err, hash) {
    database.login.hash = hash;
    // Store hash in your password DB.
  });
  db("users")
    .returning("*")
    .insert({ name: name, email: email, joined: new Date() })
    .then((user) => res.json(user[0]))
    .catch((err) => res.status(400).json("unable to register"));
  // console.log(database);
});

app.get("/profile/:id", (req, res) => {
  const { id } = req.params;

  db("users")
    .select("*")
    .where({
      id: id,
    })
    .then(
      (user) => {
        if (user.length) {
          res.json(user[0]);
        }
      }
      // res.json(user)
    )
    .catch((err) => res.status(400).json("user not found"));
  // database.users.forEach((user) => {
  //   if (user.id === Number(id)) {
  //     // console.log(user.id);
  //     found = true;
  //     // console.log(user);
  //     return res.json(user);
  //   }
  // });

  //Alternative code
  // const user = database.users.filter((user) => {
  //   found = true;
  //   return user.id === Number(id);
  // });
  // res.json(user.at(0));
  // if (!found || !user) {
  //   res.status(400).json("no user");
  // }
});

app.put("/image", (req, res) => {
  const { id } = req.body;
  let found = false;
  database.users.forEach((user) => {
    if (user.id === Number(id)) {
      found = true;
      user.entries++;
      return res.json(user.entries);
    }
  });
  if (!found) {
    res.status(400).json("no image loaded");
  }
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
