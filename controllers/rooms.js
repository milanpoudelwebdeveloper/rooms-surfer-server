import db from "../db/index.js";

export const getAllRooms = async (req, res) => {
  res.status(200).json({ message: "Get All Rooms" });
};

export const createRoom = async (req, res) => {
  const { longitude, latitude, price, title, description, images } = req.body;

  if (!Object.values(req.body).every((el) => el !== undefined || el !== null)) {
    return res.status(400).json({ message: "Please fill all fields" });
  }

  try {
    const q = await db.query(
      "INSERT INTO room(longitude, latitude, price, title, description, images) VALUES($1, $2, $3, $4, $5, $6) RETURNING *",
      [longitude, latitude, price, title, description, images]
    );
    if (q.rows.length > 0) {
      return res.status(201).json({
        message: "Room created successfully",
        room: q.rows[0],
      });
    } else {
      return res
        .status(500)
        .json({ message: "Something went wrong while creating room" });
    }
  } catch (e) {
    if (e.constraint === "images_length") {
      return res
        .status(400)
        .json({ message: "Please upload at least 2 images" });
    } else {
      return res.status(500).json({ message: "Something went wrong" });
    }
  }
};
