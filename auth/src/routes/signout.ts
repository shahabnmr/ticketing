import express from "express";

const router = express.Router();

router.post("/api/users_/signout", (req, res) => {
  req.session = null;

  res.send({});
});

export { router as signOutRouter };
