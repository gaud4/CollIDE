const mongoose = require('mongoose');

const codeFileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  content: { type: String, required: true },
  language: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const CodeFile = mongoose.model('CodeFile', codeFileSchema);

module.exports = CodeFile;