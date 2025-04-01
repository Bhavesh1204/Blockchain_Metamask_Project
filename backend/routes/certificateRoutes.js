const express = require("express");
const router = express.Router();
const Certificate = require("../models/Certificate");

// Issue a new certificate and store it in MongoDB
router.post("/issue", async (req, res) => {
  const { recipient, course, institution, certHash } = req.body;

  const newCertificate = new Certificate({
    recipient,
    course,
    institution,
    certHash,
  });

  await newCertificate.save();
  res.json({ message: "✅ Certificate stored in MongoDB", certHash });
});

// Retrieve all certificates
router.get("/certificates", async (req, res) => {
  const certificates = await Certificate.find();
  res.json(certificates);
});

module.exports = router;
