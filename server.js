const express = require("express");

const app = express();

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
};
app.listen(3000, () => {
  console.log("working fine app is running on port 3000");
});
app.get("/", (req, res) => {
  res.send(database.users);
});

app.post("/signin", (req, res) => {
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

/*
/  --> res -- this is working
/signin -->POST success/fail
/regtister --> POST = user
/profile/:userId -- GET = user
/image  --> PUT --> = user

*/
