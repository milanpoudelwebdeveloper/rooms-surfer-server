import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import AuthRoutes from "./routes/auth.js";
import RoomsRoute from "./routes/rooms.js";
import UserRoutes from "./routes/users.js";
import passport from "passport";
import cookieParser from "cookie-parser";
import "./passport.js";

dotenv.config();

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

app.use(passport.initialize());
// app.use(passport.session());

app.use("/api/auth", AuthRoutes);
app.use("/api/rooms", RoomsRoute);
app.use("/api/users", UserRoutes);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
