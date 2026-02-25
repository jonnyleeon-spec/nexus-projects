import express from "express";
import {
  register,
  login,
  getProfile,
  approveUser,
  getPendingUsers,
} from "../controllers/authController";
import {
  updateOnlineStatus,
  getOnlineUsers,
  getOnlineStats,
  debugOnlineUsers, // 🆕 NUEVO IMPORT
} from "../controllers/onlineController";
import { authenticate } from "../middleware/auth";

const router = express.Router();

// Rutas de autenticación
router.post("/register", register);
router.post("/login", login);
router.get("/profile", authenticate, getProfile);

// Rutas de administración
router.get("/admin/pending-users", authenticate, getPendingUsers);
router.put("/admin/approve-user/:userId", authenticate, approveUser);

// 🆕 RUTAS DE SISTEMA ONLINE ACTUALIZADAS
router.post("/online", authenticate, updateOnlineStatus);
router.get("/online-users", authenticate, getOnlineUsers);
router.get("/online-stats", authenticate, getOnlineStats);
router.post("/online/heartbeat", authenticate, updateOnlineStatus); // Reutiliza updateOnlineStatus
router.get("/online/debug", authenticate, debugOnlineUsers); // 🆕 NUEVA RUTA DEBUG

export default router;
