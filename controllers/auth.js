import db from "../db/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const refreshToken = async (req, res) => {
  let refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({
      message: "User not authenticated.",
    });
  }
  try {
    jwt.verify(
      refreshToken,
      process.env.REFRESH_SECRET_KEY,
      async (err, decoded) => {
        if (err) {
          return res.status(403).json({
            message: "Forbidden, invalid tokens",
          });
        }
        console.log("the decoded id is: ", decoded.id);
        const foundUser = await db.query("SELECT * FROM users WHERE id = $1", [
          decoded.id,
        ]);
        if (foundUser.rows.length <= 0) {
          return res.status(404).json({
            message: "User not found.",
          });
        }
        const accessToken = jwt.sign(
          {
            id: decoded.id,
          },
          process.env.ACCESS_SECRET_KEY,
          {
            expiresIn: "15m",
          }
        );
        res.cookie("accessToken", accessToken, {
          httpOnly: true,
          sameSite: "none",
          secure: true,
        });
        res.status(200).json({
          user: foundUser.rows[0],
        });
      }
    );
  } catch (e) {
    console.log("Something went wrong while refreshing token", e);
    res.status(500).json({
      message: "Something went wrong while refreshing token",
    });
  }
};

export const createUser = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: "Please fill all the fields." });
  try {
    const q = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (q.rows.length > 0) {
      return res.status(400).json({
        message: "User already exists.",
      });
    }
    let hashedPassword;
    if (password) {
      const genSalt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, genSalt);
    }
    await db.query(
      "INSERT INTO users(name, email, password) VALUES ($1, $2, $3)",
      [name, email, hashedPassword || null]
    );
    res.status(201).json({
      message: "User created successfully. You can log in now",
    });
  } catch (e) {
    console.log("Something went wrong while creating account", e);
    res.status(500).json({
      message: "Something went wrong while creating account",
    });
  }
};

export const generateTokens = (user, res) => {
  console.log("the user for generating tokens", user);
  const accessToken = jwt.sign(
    {
      id: user.id,
    },
    process.env.ACCESS_SECRET_KEY,
    {
      expiresIn: "15m",
    }
  );

  const refreshToken = jwt.sign(
    {
      id: user.id,
    },
    process.env.REFRESH_SECRET_KEY,
    {
      expiresIn: "1d",
    }
  );
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  console.log("cookies set");
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Please fill all the fields." });
  try {
    const q = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (q.rows.length === 0) {
      return res.status(404).json({
        message: "User not found.",
      });
    }
    const isMatch = await bcrypt.compare(password, q.rows[0].password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Password is not correct",
      });
    }
    const { password: userPassword, ...others } = q.rows[0];
    generateTokens(others, res);
    res.status(200).json({
      message: "User logged in successfully",
      user: others,
    });
  } catch (e) {
    console.log("Something went wrong while logging in user", e);
    res.status(500).json({
      message: "Something went wrong while logging in user",
    });
  }
};

export const logOutUser = async (req, res) => {
  try {
    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");

    res.status(200).json({
      message: "User logged out successfully.",
    });
  } catch (e) {
    console.log("Something went wrong while logging out user", e);
    res.status(500).json({
      message: "Something went wrong while logging out user",
    });
  }
};
