import express from "express";

import { currentUser } from "@mrshahabtickets/common";

const router = express.Router();

router.get("/api/users_/currentuser", currentUser, (req, res) => {
  res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
