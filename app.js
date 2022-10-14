const express = require("express");
const mongoose = require("mongoose");
const cards = require("./routes/cards");
const users = require("./routes/users");

const { PORT = 3000, MONGO_URL = "mongodb://localhost:27017/mestodb" } =
  process.env;
const app = express();

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
});

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: "",
  };

  next();
});

app.use("/users", users);
app.use("/cards", cards);

app.use("*", (req, res) => {
  res.status(404).send({ message: "Запрашиваемый ресурс не найден." });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
