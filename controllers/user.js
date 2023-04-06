import db from "../db/index.js";

export const getUser = async (req, res) => {
  try {
    const q = await db.query("SELECT * FROM users WHERE id = $1", [req.user]);
    if (q.rows.length > 0) {
      let user = q.rows[0];
      const { password, ...userWithoutPassword } = user;
      return res.status(200).json({
        user: userWithoutPassword,
      });
    }
    res.status(404).json({
      message: "User not found.",
    });
  } catch (e) {
    console.log("Something went wrong while getting user", e);
    res.status(500).json({
      message: "Something went wrong while getting user",
    });
  }
};

export const updateUser = async (req, res) => {

  try {
    const { name, photourl } = req.body;
    if (req.params.id != req.user) {
      return res.status(401).json({
        message: "You are not authorized to update this user",
      });
    }
    const q = await db.query(
      "UPDATE users SET name = $1, photoUrl = $2 WHERE id = $3 RETURNING *",
      [name, photourl, req.params.id]
    );
    if (q.rows.length > 0) {
      return res.status(200).json({
        message: "User updated successfully",
        user: q.rows[0],
      });
    }
  } catch (e) {
    console.log("Something went wrong while updating user", e);
    res.status(500).json({
      message: "Something went wrong while updating user",
    });
  }
};
