import express from "express";
import {
  getPendingUsers,
  approveUser,
  rejectUser,
  getUsersStats,
} from "../controllers/adminController";
import { authenticate } from "../middleware/auth";

const router = express.Router();

router.use(authenticate); // Todas las rutas requieren autenticación

router.get("/users/pending", getPendingUsers);
router.get("/users/stats", getUsersStats);
router.patch("/users/:userId/approve", approveUser);
router.patch("/users/:userId/reject", rejectUser);

export default router;
