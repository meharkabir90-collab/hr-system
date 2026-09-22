const express = require("express");
const {
	registerCandidate,
	loginCandidate,
} = require("../controller/candidateAuthController");

const router = express.Router();

router.post("/register", registerCandidate);
router.post("/login", loginCandidate);

module.exports = router;