const authMiddleware = require("./authMiddleware");
const Candidate = require("../models/candidateAuth");

const candidateMiddleware = (req, res, next) => {
  authMiddleware(req, res, async () => {
    if (req.user?.role !== "Candidate") {
      return res.status(403).json({
        success: false,
        message: "Candidate access required",
      });
    }

    try {
      req.candidate = await Candidate.findById(req.user.id).select("name email username");
      if (!req.candidate) {
        return res.status(401).json({
          success: false,
          message: "Candidate account not found",
        });
      }
      next();
    } catch (error) {
      next(error);
    }
  });
};

module.exports = candidateMiddleware;