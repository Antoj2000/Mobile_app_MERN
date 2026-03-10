// src/controllers/statusController.js
function getStatus(req, res) {
  res.json({ message: "API is running" });
}

module.exports = { getStatus };