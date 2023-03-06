import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import db from "./db/index.js";
import dotenv from "dotenv";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
      scope: ["profile", "email"],
      session: false,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const q = await db.query("SELECT * FROM users WHERE email = $1", [
          profile.emails[0].value,
        ]);
        if (q.rows.length > 0) {
          return done(null, q.rows[0]);
        }
        const newUser = await db.query(
          "INSERT INTO users(name, email, password, photoUrl) VALUES ($1, $2, $3, $4) RETURNING *",
          [
            profile.displayName,
            profile.emails[0].value,
            null,
            profile.photos[0].value,
          ]
        );
        return done(null, newUser.rows[0]);
      } catch (e) {
        console.log("Something went wrong while authenticating user", e);
        return done(e);
      }
    }
  )
);

export default passport;
