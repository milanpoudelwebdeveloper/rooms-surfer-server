import expresss from "express";
import { getUser, updateUser } from "../controllers/user.js";

import { verifyJwt } from "../middlewares/verifyJwt.js";

const router = expresss.Router();

router.get("/", verifyJwt, getUser);
router.put("/update/:id", verifyJwt, updateUser);

export default router;
