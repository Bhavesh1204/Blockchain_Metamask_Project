const mongoose = require("mongoose");

const CertificateSchema = new mongoose.Schema({
  recipient: String,
  course: String,
  institution: String,
  issueDate: { type: Date, default: Date.now },
  certHash: String,  // Store the blockchain hash
});

module.exports = mongoose.model("Certificate", CertificateSchema);
