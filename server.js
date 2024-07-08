const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const app = express();
const cors = require("cors");
const knex = require("knex");
const register = require("./controllers/register");
const signin = require("./controllers/signin");
const image = require("./controllers/image");
const profile = require("./controllers/profile");

const db = knex({
  client: "pg",
  connection: {
    host: "postgresql-aerodynamic-68704",
    // port: 3306,
    user: "emameziebebeinwe",
    password: "",
    database: "smart-brain",
  },
});

//creating middlewares
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("success");
});

app.post("/signin", (req, res) => {
  signin.handleSignIn(req, res, db, bcrypt);
});

app.post("/register", (req, res) =>
  register.handleRegister(req, res, db, bcrypt)
);

// app.post("imageGet", (res, req) => image.handleImageGet(req, res));

app.get("/profile/:id", (req, res) => profile.handleProfileGet(req, res, db));

app.put("/image", (req, res) => image.handleImage(req, res, db));

const PORT = process.env.PORT;
app.listen(PORT || 3000, () => {
  console.log(`server is listening on port ${PORT}`);
});

console.log(PORT);
