import express from "express";
import { getAllRooms } from "../controllers/rooms.js";

const router = express.Router();

router.get("/", getAllRooms);

export default router;
