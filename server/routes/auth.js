const express = require("express");
const {
  signUp,
  signIn,
  logOut,
  loginWithGoogle,
} = require("../controllers/auth");
const { verifyToken } = require("../middleware/verifyToken");

const router = express.Router();

router.post("/sign-up", signUp);
router.post("/sign-in", signIn);
router.post("/sign-in/google", loginWithGoogle);
router.post("/logout", logOut);

module.exports = router;
