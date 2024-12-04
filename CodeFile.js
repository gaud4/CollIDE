const mongoose = require("mongoose");

const codeFileSchema = new mongoose.Schema({
  room: { type: String, required: true },
  content: { type: String, required: true },
});

const CodeFile = mongoose.model("CodeFile", codeFileSchema);

module.exports = CodeFile;
