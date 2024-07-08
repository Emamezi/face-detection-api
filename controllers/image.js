const Clarifai = require("clarifai");

const handleImage = (req, res, db) => {
  const { id } = req.body;
  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => res.json(entries[0].entries))
    .catch((err) => json.status(400).json("unable to get count"));
};

module.exports = {
  handleImage,
  // handleImgaeGet,
};
