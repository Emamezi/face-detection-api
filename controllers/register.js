const handleRegister = (req, res, db, bcrypt) => {
  const { email, name, password } = req.body;
  if (!email || !name || !password) {
    return res.status(400).json("incorrect form validation");
  }
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
};

module.exports = {
  handleRegister,
};
