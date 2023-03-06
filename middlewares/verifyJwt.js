import jwt from "jsonwebtoken";

export const verifyJwt = (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    jwt.verify(accessToken, process.env.ACCESS_SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          message: "Unauthorized",
        });
      }
      req.user = decoded.id;
      next();
    });
  } catch (e) {
    res.status(500).json({
      message: "Something went wrong while verifying token",
    });
  }
};
