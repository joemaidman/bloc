var path = require("path");

module.exports = {
  entry: path.join(__dirname, "server.js"),
  target: "node",
  output: {
    path: path.join(__dirname, "./public/build"),
    filename: "bundle.js",
  },
};
