const mongoose = require("mongoose");

const dbUrl = "mongodb://0.0.0.0:27017/usersDb";
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
const connection = mongoose.createConnection(dbUrl, options, (err) => {
  if (!err) {
    console.log("connected to db");
  } else {
    console.error(err);
  }
});

const schema = new mongoose.Schema({
  username: String,
  hash: String,
  salt: String,
});

const model = connection.model("User", schema);

module.exports = connection;
