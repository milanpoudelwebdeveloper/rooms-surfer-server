export const createRoom = async (req, res) => {
  res.status(200).json({ message: "Create Room" });
};

export const getAllRooms = async (req, res) => {
  res.status(200).json({ message: "Get All Rooms" });
};
