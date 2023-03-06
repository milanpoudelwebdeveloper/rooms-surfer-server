import express from "express";
import passport from "passport";
import {
  createUser,
  generateTokens,
  loginUser,
  logOutUser,
  refreshToken,
} from "../controllers/auth.js";
import db from "../db/index.js";
import { verifyJwt } from "../middlewares/verifyJwt.js";

const router = express.Router();

router.get("/login/failed", (req, res) => {
  res.status(401).json({
    message: "User failed to authenticate.",
  });
});

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
    session: false,
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  async (req, res) => {
    try {
      const q = await db.query("SELECT * FROM users WHERE email = $1", [
        req.user.email,
      ]);
      if (q.rows.length > 0) {
        generateTokens(q.rows[0], res);
        res.redirect("http://localhost:3000");
      } else {
        res.status(404).json({
          message: "User not found.",
        });
      }
    } catch (e) {
      console.log("Something went wrong while getting user", e);
      res.status(500).json({
        message: "Something went wrong",
      });
    }
  }
);

router.post("/signUp", createUser);

router.post("/signIn", loginUser);

router.get("/refresh", refreshToken);

router.get("/logout", verifyJwt, logOutUser);

export default router;
