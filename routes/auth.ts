import express, { Router } from "express";
const router = express.Router();

//Auth Routes
router.use("/auth/login", (req, res, next) => {
  res.render("<p>HELLO WORLD</p>");
});

export default router;
