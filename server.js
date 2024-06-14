const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const app = express();
//creating a middleware
app.use(express.json());

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

  bcrypt.compare(
    "grape",
    "$2a$10$CVzpB5h/4rJrY0Rf0Nq6OuErDQrVFl9HRA7qWbW.PBvJxokL0A1r.",
    function (err, res) {
      console.log("first guess:", res);
      // res == true
    }
  );

  bcrypt.compare(
    "veggies",
    "$2a$10$CVzpB5h/4rJrY0Rf0Nq6OuErDQrVFl9HRA7qWbW.PBvJxokL0A1r.",
    function (err, res) {
      // res = false
      console.log("second guess:", res);
    }
  );
  if (
    req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password
  ) {
    res.json("successful");
  } else {
    res.status(400).json("error signing in ");
  }
});

app.post("/register", (req, res) => {
  const { email, name, password } = req.body;
  bcrypt.hash(password, null, null, function (err, hash) {
    database.login.hash = hash;
    console.log(database.login);
    // Store hash in your password DB.
    console.log(hash);
  });
  database.users.push({
    id: 125,
    name: name,
    email: email,
    password: password,
    entries: 0,
    joined: new Date(),
  });
  res.json(database.users.at(-1));
  console.log(database);
});

app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  let found = false;
  database.users.forEach((user) => {
    if (user.id === Number(id)) {
      console.log(user.id);
      found = true;
      console.log(user);
      return res.json(user);
    }
  });
  if (!found) {
    res.status(400).json("user not found");
  }

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
